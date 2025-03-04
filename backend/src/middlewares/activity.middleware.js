const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const isInActivity = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const { activityId } = req.params;
        const user = await db.User.findOne({ _id: id, "activities._id":activityId });
        if(!user){
            return res.status(400).json({ error: { status: 400, message: "The user is not assigned in the activity" } })
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
