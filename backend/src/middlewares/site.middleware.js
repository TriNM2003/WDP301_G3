const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");

const isInSite = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { siteId } = req.params;
        const user = await db.User.findOne({ _id: id});
        if(user.site!=siteId ){
            return res.status(400).json({ error: { status: 400, message: "User is not permitted to access the site." } })

        }
        next();
    } catch (error) {
        next(error)
    }

}

const isSiteOwner = async (req, res ,next) => {
    try {
        const { id } = req.payload;
        const { siteId } = req.params;
        const site = await db.Site.findById(siteId);
        const member = site.siteMember.find(member => member._id.toString() === id);
        const isOwner = member ? member.roles.includes("siteOwner") : false;
        if(!isOwner){
            return res.status(400).json({ error: { status: 400, message: "User is the site owner." } })

        }
        next();
    } catch (error) {
        next(error)
    }
}

const siteMiddleware = {
    isInSite,
    isSiteOwner,
}

module.exports = siteMiddleware;
