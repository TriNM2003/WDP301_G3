const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const getProjectById = async (req, res, next) => {
    try {
       
        res.status(200).json(systemRoles);
    } catch (error) {
        next(error);
    }
}

const ProjectController = {
    getProjectById
}

module.exports = ProjectController;