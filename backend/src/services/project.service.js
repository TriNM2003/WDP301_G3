const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getProjectById = async(projectId)=>{
    try {
        const project = await db.Project.findById(projectId)
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


const projectService = {
    getProjectById,
    getAllProjects,
    getProjectsInSite
}

module.exports = projectService;