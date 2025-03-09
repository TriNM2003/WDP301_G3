
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { slugify } = require('../utils/slugify.util');






const getProjectById = async (projectId) => {
    try {
        const project = await db.Project.findById(projectId)
            .populate({
                path: "projectMember._id",
                select: "username fullName"
            }).populate("site");
        return project;
    } catch (error) {
        throw error;
    }
}

const getAllProjects = async()=>{
    try {
        const project = await db.Project.find({})
        return project;
    } catch (error) {
        throw error;
    }
}
const getProjectsInSite = async(siteId)=>{
    try {
        const project = await db.Project.find({site:siteId})
        return project;
    } catch (error) {
        throw error;
    }
}

const createProject = async (projectData, creatorId, siteId) => {
    try {

        const site = await db.Site.findById(siteId).populate({
            path: "siteMember._id",
            select: "_id"
        });

        if (!site) {
            throw new Error("Site not found");
        }

        
        const siteMemberIds = site.siteMember.map(member => member._id?._id.toString());

        const isValidMembers = projectData.projectMember.every(memberId => 
            siteMemberIds.includes(memberId.toString())
        );
        if (!isValidMembers) {
            throw new Error("Some members are not part of the site");
        }
        const projectSlug = slugify(projectData.projectName);

        // Định dạng danh sách projectMembers
        const projectMembers = [
            { _id: creatorId, roles: ["projectManager"] }, 
            ...(projectData.projectMember?.map(memberId => ({
                _id: memberId,
                roles: ["projectMember"]
            })) || [])
        ];

        const newProject = new db.Project({
            projectName: projectData.projectName,
            projectSlug: projectSlug,
            projectStatus: "active",
            projectMember: projectMembers,
            site: siteId,
            projectRoles: projectData.projectRoles || ["projectManager", "projectMember"],
            projectAvatar: projectData.projectAvatar || "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
        });

        const savedProject = await newProject.save();

         // Cập nhật danh sách project của các user trong model User
         const memberIds = projectMembers.map(member => member._id);
         await db.User.updateMany(
             { _id: { $in: memberIds } },
             { $push: { projects: savedProject._id } }
         );             

        return savedProject;
    } catch (error) {
        throw error;
    }
};





const projectService = {
    getProjectById,
    getAllProjects,
    getProjectsInSite,
    createProject
}

module.exports = projectService;