const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const createHttpErrors = require("http-errors");
const { cloudinary } = require('../configs/cloudinary');
const fs = require('fs');
const nodemailer = require("nodemailer");

const getAllUsers = async () => {
    return await db.User.find({});
};

const getUserById = async (userId) => {
    try {
        return await db.User.findById(userId);
    } catch (error) {
        throw error;
    }
};

const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    try {
        const user = await db.User.findById(userId);
        if (!user) throw new Error("User not found");

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) throw new Error("Old password is incorrect");
        if (newPassword !== confirmPassword) throw new Error("New password and confirmation do not match");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.User.findByIdAndUpdate(userId, { password: hashedPassword });
        return { message: 'Password changed successfully' };
    } catch (error) {
        throw error;
    }
};

const editProfile = async (userId, fullName, address, dob, phoneNumber, file) => {
    try {
        const user = await db.User.findById(userId);
        if (!user) throw new Error("User not found");

        let newAvatarUrl = user.userAvatar;
        if (file) {
            const result = await cloudinary.uploader.upload(file.path);
            if (result && result.secure_url) {
                newAvatarUrl = result.secure_url;
                fs.unlink(file.path, (err) => { if (err) console.error("Error deleting local file:", err); });
            } else {
                throw new Error("Failed to upload image");
            }
        }

        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.dob = dob;
        user.address = address;
        user.userAvatar = newAvatarUrl;

        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

const sendDeleteAccountEmail = async (userId, email) => {
    try {
        const user = await db.User.findById(userId);
        if (!user) throw new Error("User not found");
        if (email !== user.email) throw new Error("Incorrect email");

        const deleteLink = `http://localhost:3000/profile/confirm-delete`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Confirm Account Deletion",
            html: `<h2>Confirm Account Deletion</h2><p>Click the button below to permanently delete your account:</p>
                <a href="${deleteLink}" style="padding: 10px 20px; background: red; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Delete</a>`
        };

        await transporter.sendMail(mailOptions);
        return { message: "A confirmation email has been sent. Please check your inbox." };
    } catch (error) {
        throw error;
    }
};

const confirmDeleteAccount = async (token) => {
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await db.User.findById(decoded.id);
        if (!user) throw new Error("User not found!");

        user.status = "deactived";
        await user.save();
        return { message: "Account deactivated successfully" };
    } catch (error) {
        throw new Error("Invalid or expired token!");
    }
};

const userService = {
    getAllUsers,
    getUserById,
    changePassword,
    editProfile,
    sendDeleteAccountEmail,
    confirmDeleteAccount
};

module.exports = userService;
