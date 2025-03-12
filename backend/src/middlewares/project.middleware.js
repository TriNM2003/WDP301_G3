const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const morgan = require("morgan");   
const db = require("../models");

const isInProject = async (req, res, next) => {
    try {
        const { id } = req.payload;     
        const { projectId, siteId } = req.params;
        const user = await db.User.findOne({ _id: id, projects:{$in:projectId} });
        const site = await db.Site.findOne({_id:siteId, "siteMember._id":id},{ "siteMember.$": 1 })
        

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
        const project = await db.Project.findOne({ _id: projectId, "projectMember._id":id},{ "projectMember.$": 1 });
        console.log(project);
        if(!project || !project.projectMember.length){
            return res.status(400).json({ error: { status: 400, message: "User is not permitted to access the project." } })
        }
        if(!project.projectMember[0].roles.includes("projectManager")){
            return res.status(400).json({ error: { status: 400, message: "User does not have permission." } })
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
