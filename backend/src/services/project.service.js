const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

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
const getProjectBySiteId = async (siteId) => {
    try {
        const project = await db.Project.find(siteId)
        return project;
    } catch (error) {
        throw error;
    }
}


const projectService = {
    getProjectById
}

module.exports = projectService;