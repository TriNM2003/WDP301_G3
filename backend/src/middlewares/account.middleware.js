const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");


const isActive = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const user = await db.User.findOne({ _id: id});
        if(user.status !="active" ){
            return res.status(400).json({ error: { status: 400, message: "The user account is not active!" } })
        }
        next();
    } catch (error) {
        next(error)
    }

}

const accountMiddleware = {
    isActive
}

module.exports = accountMiddleware;
