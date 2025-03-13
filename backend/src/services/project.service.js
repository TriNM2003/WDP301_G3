
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

const getAllProjects = async () => {
    try {
        const project = await db.Project.find({})
        return project;
    } catch (error) {
        throw error;
    }
}
const getProjectsInSite = async (siteId) => {
    try {
        const project = await db.Project.find({ site: siteId })
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

// site owner tao project va assign project manager
const createProjectV2 = async (siteId, projectManagerId, projectName) => {
    const site = await db.Site.findById(siteId);
    if(!site){
        throw new Error("Site does not exist");
    }
    const projectManager = await db.User.findById(projectManagerId);
    if(!projectManager){
        throw new Error("User does not exist");
    }

    const siteMember = site.siteMember.find(member => member._id?.toString() === projectManager._id?.toString());
    if(!siteMember){
        throw new Error("Assigned user is not a member of site");
    }

    const projectSlug = slugify(projectName);
    const newProject = await db.Project.create({
        projectName: projectName,
        projectSlug: projectSlug,
        projectStatus: "active",
        projectMember: [{_id: projectManager._id, roles:["projectManager"]}],
        site: site._id,
        projectRoles: ["projectManager", "projectMember"],
        projectAvatar: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
    })

    //theo project vao user
    await db.User.findOneAndUpdate(
        {_id: projectManager._id},
        {$addToSet: {projects: newProject._id}}
    )

    return newProject;
}

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

const deleteProject = async (projectId) => {
    const project = await db.Project.findById(projectId);
    if (!project) throw new Error("Project not found");

    // chuyen project sang trang thai destroyed
    project.projectStatus = "destroyed";
    await project.save();
};


const getProjectMembersById = async (projectId) => {
    try {
        const project = await db.Project.findById(projectId).populate("projectMember._id");
        if (!project) {
            throw new Error("No project found");
        }
        const projectMember = project?.projectMember?.map(member => {
            return {
                projectMember: member._id,
                roles: member.roles
            }
        })
        return projectMember;
    } catch (error) {
        throw error;
    }
}

const addProjectMember = async (siteId, projectId, projectMemberId, projectMemberRole) => {
    try {
        const project = await db.Project.findById(projectId);
        const site = await db.Site.findById(siteId);
        if (!project) {
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if (!projectMember) {
            throw new Error("User not found");
        }

        //check xem user co trong site chua
        const isInSite = site.siteMember.find(member => member._id.toString() === projectMember._id.toString());
        if (!isInSite) {
            throw new Error("User not in site");
        }
        // console.log(projectMember._id); return "ok"
        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if (isInProject) {
            throw new Error("User already in project");
        }

        //add project member
        const updatedProject = await db.Project.findOneAndUpdate(
            {_id: projectId},
            {$addToSet: {projectMember: {_id: projectMemberId, roles: projectMemberRole}} },
            { new: true}
        ).populate("projectMember._id");

        // cap nhap project trong user
        await db.User.findOneAndUpdate(
            {_id: projectMember._id},
            {$addToSet: {projects: projectId}}
        )

        const updatedProjectMember = updatedProject?.projectMember?.map(member => {
            return {
                projectMember: member._id,
                roles: member.roles
            }
        })
        return updatedProjectMember;
    } catch (error) {
        throw error;
    }
}

const editProjectMemberRole = async (projectId, projectMemberId, updatedRoleList) => {
    try {
        // console.log(projectId, projectMemberId, newRole); return "ok"
        const project = await db.Project.findById(projectId);
        if (!project) {
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if (!projectMember) {
            throw new Error("User not found");
        }

        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if (!isInProject) {
            throw new Error("User is not in project");
        }


        //edit project member from project
        const projectMemberList = await db.Project.findOneAndUpdate(
            { "projectMember._id": projectMemberId },
            { $set: { "projectMember.$.roles":  updatedRoleList} }, 
            { new: true } 
        ).select("projectMember")

        return projectMemberList;
    } catch (error) {
        throw error;
    }
}

const removeProjectMember = async (projectId, projectMemberId) => {
    try {
        // console.log(projectId, projectMemberId); return "ok"
        const project = await db.Project.findById(projectId);
        if (!project) {
            throw new Error("No project found");
        }
        const projectMember = await db.User.findById(projectMemberId);
        if (!projectMember) {
            throw new Error("User not found");
        }

        //check xem user co trong project chua
        const isInProject = project.projectMember.find(member => member._id.toString() === projectMemberId);
        if (!isInProject) {
            throw new Error("User is not in project");
        }

        // check xem user co phai project manager
        if (isInProject.roles.includes("projectManager")) {
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
        let updatedProject = await db.Project.findOneAndUpdate(
            { _id: projectId },
            { $pull: { projectMember: { _id: projectMemberId } } },
            { new: true}
        );
        updatedProject = await updatedProject.populate("projectMember._id");

        // remove project from member
        await db.User.findOneAndUpdate(
            {_id: projectMemberId },
            {$pull: {projects: projectId}}
        )

        const data = updatedProject?.projectMember?.map(member => {
            return {
                projectMember: member._id,
                roles: member.roles
            }
        })
        console.log(data)
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}



const projectService = {
    getProjectById,
    getAllProjects,
    getProjectsInSite,
    createProject, createProjectV2,
    editProject,
    removeToTrash,
    restoreProject,
    getProjectTrash,
    deleteProject,
    getProjectMembersById,
    addProjectMember,
    removeProjectMember,
    editProjectMemberRole,

}

module.exports = projectService;