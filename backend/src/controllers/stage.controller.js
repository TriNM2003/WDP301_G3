const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { stageService } = require('../services');

const getStagesByProjectId = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const stages = await stageService.getAllByProject(projectId)
        res.status(200).json({  status: 200, stages:stages  })
    } catch (error) {
        next(error);
    }
}


const stageController = {
    getStagesByProjectId
}

module.exports = stageController;