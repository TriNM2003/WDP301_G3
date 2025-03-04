const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const {  activityController} = require("../controllers");

const activityRouter = express.Router();


activityRouter.use(bodyParser.json());
activityRouter.get("/get-by-project-id/:projectId",
    activityController.getActivityByProjectId
)

module.exports = activityRouter;