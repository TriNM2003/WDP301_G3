const db = require('../models');

const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authService = require("../services/auth.service");
const passport = require("passport");


const changePassword = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const { oldPassword, newPassword, confirmPassword} = req.body;
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//get user by Id


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
  changePassword

};

module.exports = UserControllers;

