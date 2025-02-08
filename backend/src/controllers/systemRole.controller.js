const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const getAllSystemRoles = async (req, res, next) => {
    try {
        const systemRoles = await db.SystemRole.find();
        res.status(200).json(systemRoles);
    } catch (error) {
        next(error);
    }
}

const SystemRoleController = {
    getAllSystemRoles
}

module.exports = SystemRoleController;