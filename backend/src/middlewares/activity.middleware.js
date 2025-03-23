const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const db = require("../models");


const isInActivity = async (req, res, next) => {
  try {
    const { id } = req.payload;
    const { activityId } = req.params;
    const checkActivity = await db.Activity.findOne({ _id: activityId, isDestroyed: { $ne: true } }).populate("project");

    if (!checkActivity) {
      return res.status(400).json({ error: { status: 400, message: "Activity not found" } })
    }
    const activity = await db.Activity.findOne({ _id: activityId, $or: [{ createBy: id }, { assignee: { $in: [id] } }] })
    if (!activity) {
      return res.status(400).json({ error: { status: 400, message: "User is not permitted to access the activity." } })
    }
    next();
  } catch (error) {
    next(error)
  }

}
const isNotDone = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { parent } = req.body;

    if (!parent) {
      const checkActivity = await db.Activity.findOne({
        _id: activityId,
        isDestroyed: { $ne: true }
      })
        .populate("stage")
        .populate("project")
        .lean();

      if (checkActivity?.stage?.stageStatus?.toLowerCase() == "done") {
        return res.status(400).json({ error: { status: 400, message: "Can not edit DONE activity" } })
      }
    } else {
      const checkActivity = await db.Activity.findOne({
        _id: parent,
        isDestroyed: { $ne: true }
      })
        .populate("stage")
        .populate("project")
        .lean();

      if (checkActivity?.stage?.stageStatus?.toLowerCase() == "done") {
        return res.status(400).json({ error: { status: 400, message: "Can not edit DONE activity" } })
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};




const activityMiddleware = {
  isInActivity,
  isNotDone
}

module.exports = activityMiddleware;
