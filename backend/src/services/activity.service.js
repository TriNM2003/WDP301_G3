const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getActivitiesByProjectId = async (projectId) => {
    try {
        const activities = await db.Activity.find({ project: projectId })
            .populate("createBy")
            .populate("assignee")
            .populate("type")
            .populate("project")
            .populate("sprint")
            .populate("stage");
        return activities;
    } catch (error) {
        throw error;
    }
}

const create = async (data, project) => {
    try {
        const {
            activityTitle,
            sprint,
            stage,
            parent,
            type,
            createBy,
        } = data;

        const newActivity = new db.Activity({
            activityTitle,
            project,
            sprint,
            parent,
            stage,
            type,
            createBy,
        });
        const createdActivity = await newActivity.save();
        await db.User.findByIdAndUpdate(
            createBy, {
            $addToSet: { activities: createdActivity._id }
        }
        )
        return createdActivity;
    } catch (error) {
        throw error;
    }
}

const edit = async (data, activityId) => {
    try {
        const {
            activityTitle,
            description,
            parent,
            sprint,
            stage,
            startDate,
            dueDate,
            child,
        } = data;

        const updatedActivity = await db.Activity.findByIdAndUpdate(
            activityId,
            {
                activityTitle,
                description,
                parent,
                sprint,
                stage,
                startDate,
                dueDate,
                child,

            },
            { new: true, runValidators: true }

        )
        if (!updatedActivity) {
            throw new Error("Activity not found");
        }
        return updatedActivity;
    } catch (error) {
        throw error;
    }
}

const assignMember = async (data, activityId) => {
    try {

        const updatedActivity = await db.Activity.findByIdAndUpdate(
            activityId,
            { $addToSet: { assignee: data } }, // Tránh trùng lặp thành viên
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found");
        }

        return updatedActivity;
    } catch (error) {
        throw error;
    }
};


const remove = async (activityId) => {
    try {
        // Tìm và xóa activity theo ID
        const removedActivity = await db.Activity.findByIdAndDelete(activityId);
        if (!removedActivity) {
            throw new Error("Activity not found");
        }

        // Xóa reference của activity khỏi mảng activities trong tất cả các user có chứa activityId đó
        await db.User.updateMany(
            { activities: activityId },
            { $pull: { activities: activityId } }
        );

        return removedActivity;
    } catch (error) {
        throw error;
    }
};


const activityService = {
    getActivitiesByProjectId,
    create,
    edit,
    assignMember,
    remove
}

module.exports = activityService;