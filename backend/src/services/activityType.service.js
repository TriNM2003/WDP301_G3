const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getAll = async()=>{
    try {
        const types = db.ActivityType.find({});
        return types
    } catch (error) {
        throw  error;
    }
}

const activityTypeService = {
    getAll
}

module.exports = activityTypeService;