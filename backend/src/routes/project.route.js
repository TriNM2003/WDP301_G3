const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const { projectMiddleware, siteMiddleware } = require("../middlewares");

const projectRouter = express.Router({ mergeParams: true });


projectRouter.use(bodyParser.json());
projectRouter.get("/get-all",
    [authMiddleware.verifyAccessToken],
    projectController.getAllProjects
)

projectRouter.get("/get-by-site",
    [authMiddleware.verifyAccessToken,siteMiddleware.isInSite],
    projectController.getProjectsInSite
)
projectRouter.get("/:projectId",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    projectController.getProjectById
)


projectRouter.post("/create",
    [authMiddleware.verifyAccessToken],
    projectController.createProject
)



module.exports = projectRouter;