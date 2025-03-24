const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { notificationService } = require('../services');

const getAlls = async (req, res, next) => { 
    try {
        const { id } = req.payload;
        const notifications = await notificationService.getAllNotifications(id);
        res.status(200).json({ status: 200, message: "Get notifications successfully!", notifications: notifications })
    } catch (error) {
        next(error)
    }
}
const isSeen = async (req, res, next) => { 
    try {
        const { id } = req.payload;
        const { notificationId } = req.params;
        const notifications = await notificationService.isSeen(id,notificationId);
        res.status(201).json({ status: 201, message: "Update notifications successfully!", notifications: notifications })
    } catch (error) {
        next(error)
    }
}


const notificationController = {
    getAlls,
    isSeen
}

module.exports = notificationController;