const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const getAllUsers = async () => {
    const users = await db.User.find({});
    return users;
}

const userService = {
    getAllUsers,
}

module.exports = userService;