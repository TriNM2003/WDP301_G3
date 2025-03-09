const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const getAllUsers = async () => {
    const users = await db.User.find({});
    return users;
}
const getUserById = async(userId)=>{
    try {
        const user = await db.User.findById(userId).populate('roles');
        return user;
    } catch (error) {
        throw(error)
    }
}

const userService = {
    getAllUsers,    

    getUserById
}

module.exports = userService;