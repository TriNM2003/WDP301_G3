const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { sprintService } = require('../services');

const getByProjectId = async(req,res,next)=>{
    try {
        const {id}= req.payload;
    const {projectId}=req.params;

    const sprints = await sprintService.getByProjectId(projectId);
    return res.status(200).json({  status: 200, sprints:sprints  })
    } catch (error) {
        next(error)
    }

}

const createSprint = async(req,res,next)=>{
    try {
        const {id}= req.payload;
    const {projectId}=req.params;

    const createdSprint = await sprintService.create(req.body,projectId);
    return res.status(200).json({  status: 200, createdSprint:createdSprint  })

    } catch (error) {
        next(error)
    }
}


const sprintController = {
    getByProjectId,
    createSprint
}

module.exports = sprintController;