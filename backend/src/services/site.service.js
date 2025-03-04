const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");

const getSiteByUserId = async(userId) => {
    try {
        const site = await db.Site.findOne({
            "siteMember._id": userId
        });
        return site;
    } catch (error) {
        throw error;
    }
}


const siteService = {
    getSiteByUserId
}

module.exports = siteService;