const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { notificationService } = require('../services');

const getAlls = async (req, res, next) => { 
    try {
        const { id } = req.params;
        const notifications = await notificationService.getAllNotifications(id);
        res.status(200).json({ status: 200, message: "Get notifications successfully!", notifications: notifications })
    } catch (error) {
        next(error)
    }
}


const notificationController = {
    getAlls
}

module.exports = notificationController;