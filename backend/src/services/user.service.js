const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const createHttpErrors = require("http-errors");
const { cloudinary } = require('../configs/cloudinary');
const fs = require('fs');
const nodemailer = require("nodemailer");
const { mailer } = require('../configs');

const getAllUsers = async () => {
    return await db.User.find({});
};

const getUserByIdInfomation = async (userId) => {
    try {
        return await db.User.findById(userId).populate("roles").populate("projects").populate("activities").populate("teams").populate("site").populate("notifications");
    } catch (error) {
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        return await db.User.findById(userId).populate("roles");

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

        if (newPassword.length < 8) throw new Error("New password must be at least 8 characters long");

        if (/\s/.test(newPassword)) throw new Error("New password must not contain spaces");

        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) throw new Error("New password must not be the same as the old password");

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.User.findByIdAndUpdate(userId, { password: hashedPassword });

        return { message: 'Password changed successfully' };
    } catch (error) {
        throw error;
    }
};

const editProfile = async (userId, profileData, file) => {
    try {
        const user = await db.User.findById(userId);
        if (!user) throw new Error("User not found");

        let newAvatarUrl = user.userAvatar;
        if (file) {
            try {
                const result = await cloudinary.uploader.upload(file.path);
                if (result && result.secure_url) {
                    newAvatarUrl = result.secure_url;
                    fs.unlink(file.path, (err) => { if (err) console.error("Error deleting local file:", err); });
                } else {
                    throw new Error("Failed to upload image");
                }
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                fs.unlink(file.path, () => { });
                throw new Error("Failed to edit project! Try again.");
            }
        }

        // Validate dữ liệu đầu vào
        if (profileData.fullName && !/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(profileData.fullName)) {
            throw new Error("Full name is invalid. Only letters and spaces are allowed");
        }
        if (profileData.phoneNumber && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(profileData.phoneNumber)) {
            throw new Error("Phone number is invalid. Please enter a valid phone number");
        }
        if (profileData.dob) {
            const dobDate = new Date(profileData.dob);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const ageDiffMs = today - dobDate;
            const ageDate = new Date(ageDiffMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            if (dobDate >= today) {
                throw new Error("Date of birth must be in the past.");
            }

            if (age < 16) {
                throw new Error("You must be at least 16 years old.");
            }
        }

        const newProfile = {
            fullName: profileData.fullName || user.fullName,
            address: profileData.address || user.address,
            dob: profileData.dob || user.dob,
            phoneNumber: profileData.phoneNumber || user.phoneNumber,
            userAvatar: newAvatarUrl
        };

        const updatedUser = await db.User.findByIdAndUpdate(userId, {
            $set: {
                fullName: newProfile.fullName,
                address: newProfile.address,
                dob: newProfile.dob,
                phoneNumber: newProfile.phoneNumber,
                userAvatar: newProfile.userAvatar
            }
        }, { new: true });
        return updatedUser;
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
        const to = user.email;
        const subject = "Confirm Account Deletion";
        const body = `<h2>Confirm Account Deletion</h2><p>Click the button below to permanently delete your account:</p>
            <a href="${deleteLink}" style="padding: 10px 20px; background: red; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Delete</a>`;
        await mailer.sendEmail(to, subject, body);

        return { message: "A confirmation email has been sent. Please check your inbox." };
    } catch (error) {
        throw error;
    }
};
// get activity by userId
const getActivitiesByUserId = async (userId) => {
    try {
        const user = await db.User.findById(userId).populate({
            path: "activities",
            populate: [
                { path: "createBy", select: "fullName email" },
                { path: "assignee", select: "_id" },
                { path: "type", select: "name" },
                { path: "project", select: "projectName projectSlug" },
                { path: "sprint", select: "title" },
                { path: "stage", select: "title" }
            ]
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user.activities;
    } catch (error) {
        throw error;
    }
};

// get user info by userId from params
const getUserInfoByUserIdFromParams = async (userId) => {
    try {
        const user = await db.User.findById(userId)
            .select("username email userAvatar fullName address phoneNumber dob")
            .populate({
                path: "activities",
                populate: [
                    { path: "createBy", select: "fullName email" },
                    { path: "assignee", select: "_id" },
                    { path: "type", select: "name" },
                    { path: "sprint", select: "title" },
                    { path: "stage", select: "stageStatus stageName" },
                    { path: "project", select: "projectName" }
                ]
            })
            .populate({
                path: "projects",
                select: "projectName projectAvatar",

            });


        return user
    } catch (error) {
        throw error;
    }
}


const confirmDeleteAccount = async (token) => {
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await db.User.findById(decoded.id);
        if (!user) throw new Error("User not found!");

        // chuyển trạng thái của user thành "deactived"
        const deactivedUser = await db.User.findByIdAndUpdate(user._id, { status: "deactived" }, { new: true });
        return { message: "Account deactivated successfully", deactivedUser };
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
    confirmDeleteAccount,
    getActivitiesByUserId,
    getUserInfoByUserIdFromParams,
    getUserByIdInfomation
}


module.exports = userService;
