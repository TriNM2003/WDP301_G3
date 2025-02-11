const db = require('../models');
// const JWT = require('jsonwebtoken');
// const bcrypt = require("bcrypt")
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");


const changePassword = async (req, res, next) => {
    // try {
    //     const { oldPassword, newPassword } = req.body;
    //     const user = await db.Users.findById(req.user.id
    //     );
    //     if (!user) {
    //         return next(createHttpErrors(404, 'User not found'));
    //     }
    //     const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    //     if (!isPasswordMatch) {
    //         return next(createHttpErrors(400, 'Old password is incorrect'));
    //     }
    //     const hashedPassword = await bcrypt.hash(newPassword, 10);
    //     await db.Users.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    //     res.status(200).json({ message: 'Password changed successfully' });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }

    //not using bcrypt, using jwt for userId
    try {
        const userId = "67a9b1664bc75243014a4d17";
        const { oldPassword, newPassword } = req.body;
        const user = await db.User.findById(userId);
        if (!user) {
            return next(createHttpErrors(404, 'User not found'));
        }
        if (oldPassword !== user.password) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        await db.User.findByIdAndUpdate(userId, { password: newPassword });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const UserController = {
    changePassword

}

module.exports = UserController;