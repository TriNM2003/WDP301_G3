const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const morgan = require("morgan");   
const db = require("../models");

const isInProject = async (req, res, next) => {
    try {
        const { id } = req.payload;     
        const { projectId } = req.params;
        const user = await db.User.findOne({ _id: id, projects:{$in:projectId} });
        if(!user){
            return res.status(400).json({ error: { status: 400, message: "The user is not in the project" } })
        }
        console.log(user);
        next();
    } catch (error) {
        next(error)
    }

}

const projectMiddleware = {
    isInProject
}

module.exports = projectMiddleware;
