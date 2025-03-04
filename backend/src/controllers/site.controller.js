const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { siteService } = require('../services');



const getSiteByUserId = async (req, res, next) => {
    try {
        const {userId} = req.body;
            const site = await siteService.getSiteByUserId(userId);
            if(!site){
                return res.status(404).json({ error: { status: 404, message: "Site not found" } })
            }
            res.status(200).json(site);
    } catch (error) {
        next(error);
    }
}

const siteController = {
    getSiteByUserId
}

module.exports = siteController;