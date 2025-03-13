const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getAllByProject = async (projectId) => {
    try {
        const stages = await db.Stage.find({ project: projectId, isDestroyed: { $ne: true } })
            .populate("activities")
            .populate("project")
            .populate("parent");
        return stages;
    } catch (error) {
        throw error;
    }
}

const stageService = {
    getAllByProject
}

module.exports = stageService;