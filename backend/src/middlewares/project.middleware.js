const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const morgan = require("morgan");   
const db = require("../models");

const isInProject = async (req, res, next) => {
    try {
        const { id } = req.payload;     
        const { projectId } = req.params;
        const user = await db.User.findOne({ _id: id, projects:{$in:projectId} });
        if(!user){
            return res.status(400).json({ error: { status: 400, message: "User is not permitted to access the project." } })
        }
        next();
    } catch (error) {
        next(error)
    }

}

const isProjectManager = async (req, res, next) => {
    try {
        const { id } = req.payload;     
        const { projectId } = req.params;
        const project = await db.Project.findById(projectId);
        const isProjectManager = project.projectMember.find(member => member.roles.includes("projectManager"))._id.toString() === id;
        if(!isProjectManager){
            return res.status(400).json({ error: { status: 400, message: "User is not project manager! Request cancelled!" } })
        }
        next();
    } catch (error) {
        next(error)
    }
}

const projectMiddleware = {
    isInProject,
    isProjectManager
}

module.exports = projectMiddleware;
