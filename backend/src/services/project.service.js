const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getProjectById = async(projectId)=>{
    try {
        return 
    } catch (error) {
        throw error;
    }
}


const projectService = {
    getProjectById
}

module.exports = projectService;