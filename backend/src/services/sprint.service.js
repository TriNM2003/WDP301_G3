const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getByProjectId= async(projectId)=>{
    try {
        const sprints = await db.Sprint.find({project:projectId})
        .populate("activities");
        return sprints;
    } catch (error) {
        throw error;
    }
}

const create = async (data,project)=>{
    try {
        const{sprintName}= data;
        const sprintStatus ="planning";
        const newSprint = new db.Sprint({
            sprintName,
            project,
            sprintStatus
        });
        const createdSprint= await newSprint.save();

        return createdSprint;
    } catch (error) {
        throw error;
    }
}
const sprintService = {
    getByProjectId,
    create
}

module.exports = sprintService;