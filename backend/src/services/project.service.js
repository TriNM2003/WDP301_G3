
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { slugify } = require('../utils/slugify.util');
const { cloudinary } = require('../configs/cloudinary');
const fs = require('fs');
const notificationService = require('./notification.service');
const { mailer } = require('../configs');
const { format } = require('path');





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



        // Tạo 3 stage mặc định
        const stages = [
            { stageName: "To Do", project: savedProject._id, stageStatus: "todo" },
            { stageName: "Doing", project: savedProject._id, stageStatus: "doing" },
            { stageName: "Done", project: savedProject._id, stageStatus: "done" }
        ];

        const createdStages = await db.Stage.insertMany(stages);
        savedProject.stages = createdStages.map(stage => stage._id);
        await savedProject.save()

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
    if (!site) {
        throw new Error("Site does not exist");
    }
    const projectManager = await db.User.findById(projectManagerId);
    if (!projectManager) {
        throw new Error("User does not exist");
    }

    const siteMember = site.siteMember.find(member => member._id?.toString() === projectManager._id?.toString());
    if (!siteMember) {
        throw new Error("Assigned user is not a member of site");
    }

    const projectSlug = slugify(projectName);
    const newProject = await db.Project.create({
        projectName: projectName,
        projectSlug: projectSlug,
        projectStatus: "active",
        projectMember: [{ _id: projectManager._id, roles: ["projectManager"] }],
        site: site._id,
        projectRoles: ["projectManager", "projectMember"],
        projectAvatar: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
    })

    // Tạo 3 stage mặc định
    const stages = [
        { stageName: "To Do", project: newProject._id, stageStatus: "todo" },
        { stageName: "Doing", project: newProject._id, stageStatus: "doing" },
        { stageName: "Done", project: newProject._id, stageStatus: "done" }
    ];

    const createdStages = await db.Stage.insertMany(stages);
    newProject.stages = createdStages.map(stage => stage._id);
    await newProject.save()

    //theo project vao user
    await db.User.findOneAndUpdate(
        { _id: projectManager._id },
        { $addToSet: { projects: newProject._id } }
    )
    const to = projectManager.email;
    const subject = `You have been assigned to project ${newProject.projectName}`;
    const body = `
        <p>You have been assigned to newly created project <bold>${newProject.projectName}</bold> as <bold>project manager</bold></p<
    `;
    await mailer.sendEmail(to, subject, body);

    return newProject;
}

const editProject = async (projectId, projectData, file) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    let newProjectAvatar = project.projectAvatar;
    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path);
            if (result && result.secure_url) {
                newProjectAvatar = result.secure_url;
                fs.unlink(file.path, (err) => { if (err) console.error("Error deleting local file:", err); });
            } else {
                throw new Error("Failed to upload image");
            }
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            fs.unlink(file.path, () => { });
            throw new Error("Failed to edit project! Try again.");
        }
    }

    const newProject = {
        projectName: projectData.projectName || project.projectName,
        projectAvatar: newProjectAvatar,
        projectSlug: slugify(projectData.projectSlug || project.projectSlug),

    }


    const updatedProject = await db.Project.findByIdAndUpdate(projectId, {
        $set: {
            projectName: newProject.projectName,
            projectAvatar: newProject.projectAvatar,
            projectSlug: newProject.projectSlug,
        }
    }, { new: true });
    return updatedProject;
};

const removeToTrash = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const removedProject = await db.Project.findByIdAndUpdate(projectId, {
        $set: { projectStatus: "archived" }
    }, { new: true });
    return removedProject;
};

const restoreProject = async (projectId) => {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const restoredProject = await db.Project.findByIdAndUpdate(projectId, {
        $set: { projectStatus: "active" }
    }, { new: true });
    return restoredProject;
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
    const deletedProject = await db.Project.findByIdAndUpdate(projectId, {
        $set: { projectStatus: "destroyed" }
    }, { new: true });

    return deletedProject;
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
            { _id: projectId },
            { $addToSet: { projectMember: { _id: projectMemberId, roles: projectMemberRole } } },
            { new: true }
        ).populate("projectMember._id");

        // cap nhap project trong user
        await db.User.findOneAndUpdate(
            { _id: projectMember._id },
            { $addToSet: { projects: projectId } }
        )

        const updatedProjectMember = updatedProject?.projectMember?.map(member => {
            return {
                projectMember: member._id,
                roles: member.roles
            }
        })
        
        const to = projectMember.email;
        const subject = `You have been added to project ${project.projectName}`;
        const body = `
            <p>You have been added to project ${project.projectName} as ${projectMemberRole?.toString()}</p>
        `;
        await mailer.sendEmail(to, subject, body);


        return updatedProjectMember;
    } catch (error) {
        throw error;
    }
}

const editProjectMemberRole = async (projectManagerId, projectId, projectMemberId, updatedRoleList) => {
    try {
        // console.log(projectManagerId, projectId, projectMemberId, updatedRoleList); return;
        function camelCaseArrayToString(arr) {
            return arr.map(str => 
                str.replace(/([a-z])([A-Z])/g, '$1 $2') // Thêm khoảng trắng trước chữ in hoa
                   .replace(/\b\w/g, char => char.toUpperCase()) // Viết hoa chữ cái đầu
            ).join(', '); // Nối các phần tử bằng dấu ", "
        }
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
        if(isInProject.roles.includes("projectManager")) throw new Error("Cannot change role of Project manager")
        if(updatedRoleList.includes("projectManager")) throw new Error("Cannot assign role Project manager to project member")
        let isValidRole = true;
        for (let i = 0; i < updatedRoleList.length; i++) {
            if (!project.projectRoles.includes(updatedRoleList[i])) {
                isValidRole = false;
            }
        }
        if (!isValidRole) {
            throw new Error("New role does not exist in current project");
        }


        //edit project member from project
        const projectMemberList = await db.Project.findOneAndUpdate(
            { "projectMember._id": projectMemberId },
            { $set: { "projectMember.$.roles": updatedRoleList } },
            { new: true }
        ).select("projectMember")

        const projectManager = await db.User.findById(projectManagerId);
        // tao notification
        await notificationService.createNotification(projectManager._id,
                project.projectMember.map(member => {
                    return member._id
                }),
                `Project ${project.projectName}: Member ${projectMember.email} role has been changed to ${camelCaseArrayToString(updatedRoleList)} by Project manager ${projectManager.email}`,
                "project"
        );

        const to = projectMember.email;
        const subject = `Your role in project ${project.projectName} has been changed`
        const body = `
            Your role in project ${project.projectName} has been changed to ${camelCaseArrayToString(updatedRoleList)} by Project manager ${projectManager.email}
        `;
        await mailer.sendEmail(to, subject, body);

        return projectMemberList;
    } catch (error) {
        throw error;
    }
}

const removeProjectMember = async (removerId, projectId, projectMemberId) => {
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
            { new: true }
        );
        updatedProject = await updatedProject.populate("projectMember._id");

        // remove project from member
        await db.User.findOneAndUpdate(
            { _id: projectMemberId },
            { $pull: { projects: projectId } }
        )

        const data = updatedProject?.projectMember?.map(member => {
            return {
                projectMember: member._id,
                roles: member.roles
            }
        })

        await notificationService.createNotification(removerId,
            [projectMember._id],
            `You have been removed from project ${project.projectName}`,
            "project"
        )
        
        const to = projectMember.email;
        const subject = `You have been removed from project ${project.projectName}`;
        const body = `
            <p>You have been removed from project <b>${project.projectName}</b> </p>
        `;
        await mailer.sendEmail(to, subject, body);
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