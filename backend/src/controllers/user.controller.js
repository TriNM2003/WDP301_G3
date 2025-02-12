const db = require('../models');
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await db.Users.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const editProfile = async (req, res, next) => {
    try {
        const { fullname, address, dob, phone } = req.body;
        const  userId  = "67a9b1664bc75243014a4d17";
        //req.params;

        const user = await db.Users.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.fullName = fullname;
        user.address = address;
        user.dob = dob;
        user.phoneNumber = phone;

        await db.Users.findByIdAndUpdate
        (userId, {
            fullName: fullname,
            address: address,
            dob: dob,
            phoneNumber: phone,
        });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const UserControllers = {
    editProfile,
    getUserById,
};

module.exports = UserControllers;