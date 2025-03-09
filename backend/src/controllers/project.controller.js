const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const projectService = require('../services/project.service');

const { cloudinary } = require('../configs/cloudinary');
const path = require('path');
const fs = require('fs');

const { userService } = require('../services');

const getAllProjects = async (req, res, next) => {
    try {

        const project = await projectService.getAllProjects()
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

const getProjectsInSite = async (req, res, next) => {
    try {
        const { siteId } = req.params;

        const projects = await projectService.getProjectsInSite(siteId);
        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "Không tìm thấy dự án nào" } });
        }

        // Populate 
        const populatedProjects = await db.Project.populate(projects, {
            path: "projectMember._id",
            select: "username userAvatar email fullName"
        });

        res.status(200).json(populatedProjects);
    } catch (error) {
        next(error);
    }
};

// create project

const createProject = async (req, res, next) => {
    try {
        const creatorId = req.payload.id;
        const siteId = req.params.siteId;

        const newProject = await projectService.createProject(req.body, creatorId, siteId);

        res.status(201).json({
            message: "Project created successfully!",
            project: newProject
        });
    } catch (error) {
        res.status(400).json({ error: { status: 400, message: error.message } });
    }
};






const getProjectById = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        // Truy vấn trực tiếp từ model thay vì thông qua service nếu service không hỗ trợ populate
        const project = await projectService.getProjectById(projectId);
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } });
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

const editProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const { projectName } = req.body;
        const updatedProject = await projectService.editProject(projectId, projectName, req.file);
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.unlink(req.file.path, () => { });
        return res.status(500).json({ message: "Cant't update profile! Try again." });
    }
};

const removeToTrash = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        await projectService.removeToTrash(projectId);
        res.status(200).json({ message: "Project moved to trash successfully!" });
    } catch (error) {
        next(error);
    }
};

const restoreProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        await projectService.restoreProject(projectId);
        res.status(200).json({ message: "Project restored successfully!" });
    } catch (error) {
        next(error);
    }
};

const getProjectTrash = async (req, res, next) => {
    try {
        const { siteId } = req.params;
        const userId = req.payload.id;
        const projects = await projectService.getProjectTrash(siteId, userId);
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        await projectService.deleteProject(projectId);
        res.status(200).json({ message: "Project deleted successfully!" });
    } catch (error) {
        next(error);
    }
};


const getProjectMembersById = async (req, res, next) => {
    try {
            const projectId = req.params.projectId;
            const projectMember = await projectService.getProjectMembersById(projectId);
            res.status(200).json(projectMember);
        } catch (error) {
            console.error("Error get project members:", error);
            return res.status(400).json({ message: error.message });
        }
}

const addProjectMember = async (req, res, next) => {
    try {
        // const projectMemberId = "67c1bd8279dc063bae8ce244";
        const {projectMemberId, projectMemberRole} = req.body;
        const {siteId, projectId} = req.params;
        const projectMember = await projectService.addProjectMember(siteId, projectId, projectMemberId, projectMemberRole);
        res.status(200).json(projectMember);
    } catch (error) {
        console.error("Error add project member:", error);
        return res.status(400).json({ message: error.message });
    }
}

const editProjectMemberRole = async (req, res, nect) => {
    try {
        const {projectMemberId, newRole} = req.body;
        const {projectId} = req.params;
        const projectMember = await projectService.editProjectMemberRole(projectId, projectMemberId, newRole);
        res.status(200).json(projectMember);
    } catch (error) {
        console.error("Error editing project member:", error);
        return res.status(400).json({ message: error.message });
    }
}

const removeProjectMember = async (req, res, next) => {
    try {
        // const projectMemberId = "67c1bd8279dc063bae8ce244";
        const {projectMemberId} = req.body;
        const projectId = req.params.projectId;
        const projectMember = await projectService.removeProjectMember(projectId, projectMemberId);
        res.status(200).json(projectMember);
    } catch (error) {
        console.error("Error removing project member:", error);
        return res.status(400).json({ message: error.message });
    }
}

const projectController = {
    getProjectById,
    editProject,
    removeToTrash,
    getProjectTrash,
    restoreProject,
    deleteProject,
    getAllProjects,
    getProjectsInSite,
    createProject,
    getProjectMembersById,
    addProjectMember,
    removeProjectMember,
    editProjectMemberRole,
}

module.exports = projectController;