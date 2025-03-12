const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const sprintController = require("../controllers/sprint.controller");
const { activityMiddleware, projectMiddleware, siteMiddleware, accountMiddleware } = require("../middlewares");
const authMiddleware = require("../middlewares/auth.middleware");

const sprintRouter = express.Router({mergeParams: true});

sprintRouter.get("/get-by-project",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject],
    sprintController.getByProjectId
)

sprintRouter.post("/create",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject,projectMiddleware.isProjectManager],
    sprintController.createSprint
)

sprintRouter.use(bodyParser.json());
module.exports = sprintRouter;