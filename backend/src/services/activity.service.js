const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getActivitiesByProjectId = async (projectId) => {
    try {
        const activities = await db.Activity.find({ project: projectId, isDestroyed: { $ne: true } })
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
        const activity = await db.Activity.findOne({ _id: id, isDestroyed: { $ne: true } })
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
        // Tìm activity để kiểm tra trước khi cập nhật
        const currentActivity = await db.Activity.findOne({
            _id: activityId,
            isDestroyed: { $ne: true }
        });

        if (!currentActivity) {
            throw new Error("Activity not found or already deleted");
        }

        // Lấy dữ liệu cập nhật từ `data`
        const { activityTitle, description, parent, priority, startDate, dueDate, child } = data;

        // Cập nhật activity
        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
            {
                $set: {
                    activityTitle: activityTitle || currentActivity.activityTitle,
                    description: description !== undefined ? description : currentActivity.description,
                    parent: parent || currentActivity.parent,
                    priority: priority || currentActivity.priority,
                    startDate: startDate || currentActivity.startDate,
                    dueDate: dueDate || currentActivity.dueDate,
                    child: child || currentActivity.child,
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            throw new Error("Failed to update activity");
        }

        // Nếu có thay đổi `parent`, cập nhật parent mới và parent cũ
        if (parent && parent !== currentActivity.parent) {
            // Xóa activity khỏi parent cũ
            await db.Activity.findOneAndUpdate(
                { _id: currentActivity.parent, isDestroyed: { $ne: true } },
                { $pull: { child: activityId } }
            );

            // Thêm activity vào parent mới
            await db.Activity.findOneAndUpdate(
                { _id: parent, isDestroyed: { $ne: true } },
                { $addToSet: { child: activityId } }
            );
        }

        return updatedActivity;
    } catch (error) {
        console.error("Error updating activity:", error);
        throw error;
    }
};


const assignMember = async (data, activityId) => {
    try {

        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
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

        const updatedActivity = await db.Activity.findOneAndUpdate(
            { _id: activityId, isDestroyed: { $ne: true } },
            { $pull: { assignee: data } },
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
        await db.Activity.updateOne({ _id: activityId }, { $set: { isDestroyed: true } });

        return;
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