
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

const editProject = async (projectId, projectName, projectSlug, file) => {
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
    
    const newProject = {
        projectName: projectName || project.projectName,
        projectSlug: projectSlug || project.projectSlug,
        projectAvatar: newProjectAvatar
    }

    return await db.Project.findByIdAndUpdate(projectId, {
        $set: {
            projectName: newProject.projectName,
            projectSlug: newProject.projectSlug,
            projectAvatar: newProject.projectAvatar
        }
    }, { new: true });

};

const removeToTrash = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");
    
    return await db.Project.findByIdAndUpdate(projectId, {
        $set: {
            projectStatus: "archived"
        }
    }, { new: true });
};

const restoreProject = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    return await db.Project.findByIdAndUpdate(projectId, {
        $set: {
            projectStatus: "active"
        }
    }, { new: true });
};

const getProjectTrash = async (siteId, userId) => {
    try {
        // Tìm site và populate thành viên site
        const site = await db.Site.findById(siteId).populate("siteMember._id");
        if (!site) throw new Error("Site not found");

        // Tìm user trong siteMember để lấy roles
        const userInSite = site.siteMember.find(member => member._id._id.toString() === userId);
        const userSiteRoles = userInSite ? userInSite.roles : [];

        // Nếu user là siteOwner, lấy tất cả project trong site
        if (userSiteRoles.includes("siteOwner")) {
            return await db.Project.find({ site: siteId, projectStatus: "archived" }).populate({
                path: "projectMember._id",
                select: "fullName username email"
            });
        }

        // Nếu không phải siteOwner, tìm user trong projectMember của các project trong site
        const projects = await db.Project.find({ site: siteId, projectStatus: "archived" }).populate({
            path: "projectMember._id",
            select: "fullName username email"
        });

        // Lọc project mà user có vai trò projectManager
        const userManagedProjects = projects.filter(project =>
            project.projectMember.some(member =>
                member._id._id.toString() === userId && member.roles.includes("projectManager")
            )
        );
        return userManagedProjects;
    } catch (error) {
        console.error("Error fetching project trash:", error);
        throw error;
    }
};

const destroyProject = async (projectId) => {
    const project = await db.Project.findById(projectId);
    if (!project) throw new Error("Project not found");
    
    // chuyen project sang trang thai destroyed dung query mongodb
    return await db.Project.findByIdAndUpdate(projectId, {
        $set: {
            projectStatus: "destroyed"
        }
    }, { new: true });
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
    editProject,
    removeToTrash,
    restoreProject,
    getProjectTrash,
    destroyProject,
    getProjectMembersById,
    addProjectMember,
    removeProjectMember,
    editProjectMemberRole,

}

module.exports = projectService;