const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");

const isNotCompletedSprint = async (req, res, next) => {
    try {
        const { sprintId } = req.params; 


        const sprint = await db.Sprint.findOne({ _id: sprintId });
        if (!sprint) {

            return res.status(404).json({  status: 404, message:"Sprint does not exist"  })

        }

        if (sprint.sprintStatus == "completed") {
            return res.status(400).json({  status: 400, message:"Cannot modify a completed sprint." })

        }

        next();
    } catch (error) {
        next(error)
    }

}


const sprintMiddleware = {
    isNotCompletedSprint
}

module.exports = sprintMiddleware;
