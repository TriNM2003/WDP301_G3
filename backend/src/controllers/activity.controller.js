const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const activityService = require('../services/activity.service');



const getActivityByProjectId = async (req, res, next) => {
    try {
        const {projectId} = req.params;
       const activities = await activityService.getActivitiesByProjectId(projectId)
        res.status(200).json(activities);
    } catch (error) {
        next(error);
    }
}

const activityController = {
    getActivityByProjectId
}

module.exports = activityController;