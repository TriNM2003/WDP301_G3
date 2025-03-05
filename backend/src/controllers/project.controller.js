const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const projectService = require('../services/project.service');
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

        const newProject = await projectService.createProject(req.body, creatorId,siteId);

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
        const { projectId } = req.params;
        const project = await projectService.getProjectById(projectId)
        if (!project) {
            return res.status(404).json({ error: { status: 404, message: "Project not found" } })
        }
        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

const   projectController = {
    getProjectById,
    getAllProjects,
    getProjectsInSite,
    createProject
}

module.exports = projectController;