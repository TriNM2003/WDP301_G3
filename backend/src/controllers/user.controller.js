const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");


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

const UserController = {
    changePassword

}

module.exports = UserController;