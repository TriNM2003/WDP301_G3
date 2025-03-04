const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getActivitiesByProjectId = async (projectId) => {
    try {
        const activities = await db.Activity.find({ project: projectId });
        return activities;
    } catch (error) {
        throw error;
    }
}


const activityService = {
    getActivitiesByProjectId
}

module.exports = activityService;