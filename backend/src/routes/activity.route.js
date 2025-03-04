const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const {  activityController} = require("../controllers");
const { activityMiddleware, projectMiddleware } = require("../middlewares");
const authMiddleware = require("../middlewares/auth.middleware");

const activityRouter = express.Router();


activityRouter.use(bodyParser.json());
activityRouter.get("/get-by-project-id/:projectId",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    activityController.getActivityByProjectId
)

module.exports = activityRouter;