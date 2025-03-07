
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { slugify } = require('../utils/slugify.util');
const { cloudinary } = require('../configs/cloudinary');
const fs = require('fs');





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

const editProject = async (projectId, projectName, file) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    
    let newProjectAvatar = project.projectAvatar;
    if (file) {
        const result = await cloudinary.uploader.upload(file.path);
        if (result && result.secure_url) {
            newProjectAvatar = result.secure_url;
            fs.unlink(file.path, (err) => { if (err) console.error("Error deleting local file:", err); });
        } else {
            throw new Error("Failed to upload image");
        }
    }
    
    project.projectName = projectName;
    project.projectAvatar = newProjectAvatar;
    project.projectSlug = slugify(projectName);
    return await project.save();
};

const removeToTrash = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    
    project.projectStatus = "archived";
    return await project.save();
};

const restoreProject = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    
    project.projectStatus = "active";
    return await project.save();
};

const getProjectTrash = async () => {
    return await db.Project.find({ projectStatus: "archived" }).populate({
        path: "projectMember._id",
        select: "fullName username email"
    });
};

const deleteProject = async (projectId) => {
    const project = await db.Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    
    // Xóa project khỏi collection User
    await db.User.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
    );
    
    // Xóa project khỏi database
    return await db.Project.deleteOne({ _id: projectId });
};




const projectService = {
    getProjectById,
    getAllProjects,
    getProjectsInSite,
    createProject,
    editProject,
    removeToTrash,
    restoreProject,
    getProjectTrash,
    deleteProject
}

module.exports = projectService;