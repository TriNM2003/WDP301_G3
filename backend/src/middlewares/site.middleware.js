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

const siteMiddleware = {
    isInSite
}

module.exports = siteMiddleware;
