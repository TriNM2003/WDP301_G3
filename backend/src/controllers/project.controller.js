const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const projectService = require('../services/project.service');

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

const projectController = {
    getProjectById,
    getAllProjects
}

module.exports = projectController;