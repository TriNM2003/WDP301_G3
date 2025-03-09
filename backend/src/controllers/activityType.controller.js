const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { activityTypeService } = require('../services');

const getAllActivityTypes = async (req, res, next) => {
    try {
        const types = await activityTypeService.getAll();
        if(!types){
        return res.status(400).json({error:{  status: 400, message:"Activity types not found!"  }})
        }
        return res.status(200).json({  status: 200, types:types  })

    } catch (error) {
        next(error);
    }
}


const activityTypeController = {
    getAllActivityTypes
}

module.exports = activityTypeController;