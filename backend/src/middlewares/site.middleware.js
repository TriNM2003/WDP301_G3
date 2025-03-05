const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");

const isInSite = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { siteId } = req.params;
        const user = await db.User.findById(id);
        if(String(user.site) !== siteId){
            return res.status(400).json({ error: { status: 400, message: "The user is not in site" } })
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
