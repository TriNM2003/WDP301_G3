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
        next(error);
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
        const projects = await projectService.getProjectTrash();
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

const projectController = {
    getProjectById,
    editProject,
    removeToTrash,
    getProjectTrash,
    restoreProject,
    deleteProject,
    getAllProjects,
    getProjectsInSite,
    createProject

}

module.exports = projectController;