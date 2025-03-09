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
        const user = await db.User.findById(userId);
        return user;
    } catch (error) {
        throw(error)
    }
}

// get activity by userId
const getActivitiesByUserId = async (userId) => {
    try {
        const user = await db.User.findById(userId).populate({
            path: "activities",
            populate: [
                { path: "createBy", select: "fullName email" }, 
                { path: "assignee", select: "_id" }, 
                { path: "type", select: "name" }, 
                { path: "project", select: "projectName" }, 
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

const userService = {
    getAllUsers,    
    getUserById,
    getActivitiesByUserId
}

module.exports = userService;