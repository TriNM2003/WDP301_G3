const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const { projectMiddleware, siteMiddleware } = require("../middlewares");

const projectRouter = express.Router();


projectRouter.use(bodyParser.json());
projectRouter.get("/get-all",
    [authMiddleware.verifyAccessToken],
    projectController.getAllProjects
)
projectRouter.get("/:projectId",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    projectController.getProjectById
)
projectRouter.get("/get-by-site/:siteId",
    [authMiddleware.verifyAccessToken,siteMiddleware.isInSite],
    projectController.getProjectsInSite
)


module.exports = projectRouter;