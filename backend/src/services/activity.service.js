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

const getById = async (id) => {
    try {
        const activity = await db.Activity.findById(id)
            .populate("createBy")
            .populate("assignee")
            .populate("type")
            .populate("project")
            .populate("sprint")
            .populate("stage");
        return activity;
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
        const activity = await db.Activity.findById(activityId);
        const {
            activityTitle,
            description,
            parent,
            sprint,
            stage,
            priority,
            startDate,
            dueDate,
            child,
        } = data;

        const updatedActivity = await db.Activity.findOneAndUpdate(
            // activityId,
            // {
            //     activityTitle,
            //     description,
            //     parent,
            //     sprint,
            //     stage,
            //     priority,
            //     startDate,
            //     dueDate,
            //     child,

            // },
            // { new: true, runValidators: true }
            { _id: activityId },

            {
                $set: {
                    activityTitle: activityTitle || activity?.activityTitle,
                    description: description,
                    parent: parent || activity?.parent,
                    sprint: sprint || activity?.sprint,
                    stage: stage || activity?.stage,
                    priority: priority || activity?.priority,
                    startDate: startDate || activity?.startDate,
                    dueDate: dueDate || activity?.dueDate,
                    child: child || activity?.child,
                }
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
        const updateUser = await db.User.findByIdAndUpdate(
            data,
            { $addToSet: { activities: activityId } },
            { new: true, runValidators: true }
        )

        return updatedActivity;
    } catch (error) {
        throw error;
    }
};

const removeAssignMember = async (data, activityId) => {
    try {

        const updatedActivity = await db.Activity.findByIdAndUpdate(
            activityId,
            { $pull: { assignee: data } }, // Tránh trùng lặp thành viên
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Activity not found");
        }
        const updateUser = await db.User.findByIdAndUpdate(
            data,
            { $pull: { activities: activityId } },
            { new: true, runValidators: true }
        )

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
    getById,
    create,
    edit,
    assignMember,
    removeAssignMember,
    remove
}

module.exports = activityService;