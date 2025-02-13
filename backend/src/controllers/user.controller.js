const db = require('../models');
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");
const passport = require("passport");

//lấy token jwt để lấy thông tin user
const getUserById = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//lấy token jwt để update thông tin user
const editProfile = async (req, res, next) => {
    try {
        const { fullName, address, dob, phoneNumber } = req.body;
        const userId = req.payload.id;
        console.log(userId);
        const user = await db.Users.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.dob = dob;
        user.address = address;

        await db.Users.findByIdAndUpdate
        (userId, {
            fullName: fullName,
            phoneNumber: phoneNumber,
            dob: dob,
            address: address,            
        });
        
        res.status(200).json({ 
            fullName: fullName,
            phoneNumber: phoneNumber,
            dob: dob,
            address: address, });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const UserControllers = {
    editProfile,
    getUserById,
};

module.exports = UserControllers;