const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");


const isInActivity = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { activityId } = req.params;
        const checkActivity = await db.Activity.findById(activityId).populate("project");

        if (!checkActivity  ) {
            return res.status(400).json({ error: { status: 400, message: "Activity not found" } })
        }
        const activity = await db.Activity.findOne({ _id: activityId, $or: [{ createBy: id }, { "assignee._id": id }] })
        if (!activity) {
            return res.status(400).json({ error: { status: 400, message: "User is not permitted to access the activity." } })
        }
        next();
    } catch (error) {
        next(error)
    }

}

const activityMiddleware = {
    isInActivity
}

module.exports = activityMiddleware;
