const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const createNotification = async (from, receivers, content, type) => {
    try {
        if (!Array.isArray(receivers) || receivers.length == 0) {
            throw new Error("Receivers must be a non-empty array");
        }
        if (!content || typeof content !== "string") {
            throw new Error("Content must be a valid string");
        }
        if (!type || typeof type !== "string") {
            throw new Error("Type must be a valid string");
        }

        const validReceivers = await db.User.find(
            { _id: { $in: receivers }, status: { $ne: "deactivated" } },
            { _id: 1 }
        );

        if (validReceivers.length === 0) {
            throw new Error("No valid receivers found (may not exist or are deactivated)");
        }

        const validReceiverIds = validReceivers.map(user => user._id);

        const newNotification = {
            from: from,
            receivers: validReceiverIds,
            content: content,
            type: type,
        };

        const createdNotification = await db.Notification.create(newNotification);

        if (createdNotification) {
            await db.User.updateMany(
                { _id: { $in: validReceiverIds } },
                {
                    $addToSet: { notifications: { _id: createdNotification._id, isSeen: false } }
                }
            );
        }

        return createdNotification;
    } catch (error) {
        // console.error("Error creating notification:", error.message);
        throw error;
    }
};

const getAllNotifications = async (userId) => {
    try {
        const user = await db.User.findOne({_id:userId}).populate({
            path: 'notifications._id',
            populate: {
                path: 'from'
            }
        });

        let notifications = user.notifications?.map((noti) => ({
            ...noti?._id?.toObject(),
            isSeen: noti.isSeen
        }));

        notifications = notifications?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return notifications;
    } catch (error) {
        throw error;
    }
};
const isSeen = async (userId, notificationId) => {
    try {
        const user = await db.User.findOneAndUpdate(
            { _id: userId, "notifications._id": notificationId },
            { $set: { "notifications.$.isSeen": true } },
            { new: true }
        ).populate({
            path: 'notifications._id',
            populate: { path: 'from' }
        });

        const notifications = user.notifications
            ?.map(noti => ({
                ...noti?._id?.toObject(),
                isSeen: noti.isSeen
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return notifications;
    } catch (error) {
        throw error;
    }
};




const notificationService = {
    createNotification,
    getAllNotifications,
    isSeen
}

module.exports = notificationService;   