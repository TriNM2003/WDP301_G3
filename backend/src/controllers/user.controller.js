const db = require('../models');
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");
const passport = require("passport");


//get user by Id
const getUserById = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        console.log(user);
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const UserControllers = {
    getUserById,
};

module.exports = UserControllers;