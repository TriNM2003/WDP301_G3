const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getUserById = async(userId)=>{
    try {
        const user = await db.User.findById(userId);
        return user;
    } catch (error) {
        throw(error)
    }
}

const userService = {
    getUserById
}

module.exports = userService;