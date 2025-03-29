const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const { accountMiddleware, siteMiddleware, projectMiddleware } = require("../middlewares");
const { stageController } = require("../controllers");


const stageRouter = express.Router({mergeParams: true});
stageRouter.get("/get-all",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject],
    stageController.getStagesByProjectId
)
stageRouter.post("/update-parents",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    stageController.updateStageParents
)
stageRouter.post("/add",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    stageController.addStage
)
stageRouter.post("/update",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    stageController.updateStage
)
stageRouter.post("/delete",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    stageController.deleteStage
)

stageRouter.use(bodyParser.json());


module.exports = stageRouter;