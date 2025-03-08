
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
       
        const projectSlug = slugify(projectData.projectName);

       
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

        return savedProject;
    } catch (error) {
        throw error;
    }
};


const getProjectMembersById = async (projectId) => {
    try {
        const project = await db.Project.findById(projectId).populate("projectMember._id");
        if(!project){
            throw new Error("No project found");
        }
        return project.projectMember;
    } catch (error) {
        throw error;
    }
}

const addProjectMember = async (siteId, projectId, projectMemberId, projectMemberRole) => {
    try {
        const project = await db.Project.findById(projectId);
        const site = await db.Site.findById(siteId);
        if(!project){
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if(!projectMember){
            throw new Error("User not found");
        }

        //check xem user co trong site chua
        const isInSite = site.siteMember.find(member => member._id.toString() === projectMember._id.toString());
        if(!isInSite){
            throw new Error("User not in site");
        }
        // console.log(projectMember._id); return "ok"
        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if(isInProject){
            throw new Error("User already in project");
        }

        //add project member
        project.projectMember = [...project.projectMember, {
            _id: projectMember._id,
            roles: [projectMemberRole]
        }]
        await project.save();
        const updatedProject = await db.Project.findById(projectId).populate("projectMember._id");

        // cap nhap project trong user
        projectMember.projects = [...projectMember.projects, updatedProject._id];
        await projectMember.save();

        return updatedProject.projectMember;
    } catch (error) {
        throw error;
    }
}

const editProjectMemberRole = async (projectId, projectMemberId, newRole) => {
    try {
        // console.log(projectId, projectMemberId, newRole); return "ok"
        const project = await db.Project.findById(projectId);
        if(!project){
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if(!projectMember){
            throw new Error("User not found");
        }

        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if(!isInProject){
            throw new Error("User is not in project");
        }


        //edit project member from project
        const memberToEdit = project.projectMember.find(member => member._id.toString() === projectMemberId)
        memberToEdit.roles = [newRole];
        await project.save();
        const updatedProject = await db.Project.findById(projectId).populate("projectMember._id");


        return updatedProject.projectMember;
    } catch (error) {
        throw error;
    }
}

const removeProjectMember = async (projectId, projectMemberId) => {
    try {
        // console.log(projectId, projectMemberId); return "ok"
        const project = await db.Project.findById(projectId);
        if(!project){
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if(!projectMember){
            throw new Error("User not found");
        }

        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if(!isInProject){
            throw new Error("User is not in project");
        }

        // check xem user co phai project manager
        if(isInProject.roles.includes("projectManager")){
            throw new Error("Cannot remove project manager!");
        }

        // Kiểm tra xem user có activity nào chưa hoàn thành trong project không
        const pendingActivities = await db.Activity.find({
            project: projectId,
            assignee: projectMemberId,
            stageStatus: { $ne: "done" } // Không lấy những task đã hoàn thành
        });
        // console.log(pendingActivities.length);
        if (pendingActivities.length > 0) {
            throw new Error(`User has ${pendingActivities.length} pending activities and cannot be removed.`);
        }

        //remove project member from project
        const filteredList = project.projectMember.filter(member => member._id.toString() !== projectMemberId)
        project.projectMember = filteredList;
        await project.save();

        // remove project from member
        const updatedProject = await db.Project.findById(projectId).populate("projectMember._id");
        const filteredProjectList = projectMember.projects.filter(project => project._id.toString() !== updatedProject._id.toString())
        projectMember.projects = filteredProjectList;
        await projectMember.save();

        return updatedProject.projectMember;
    } catch (error) {
        throw error;
    }
}



const projectService = {
    getProjectById,
    getAllProjects,
    getProjectsInSite,
    createProject,
    getProjectMembersById,
    addProjectMember,
    removeProjectMember,
    editProjectMemberRole,
}

module.exports = projectService;