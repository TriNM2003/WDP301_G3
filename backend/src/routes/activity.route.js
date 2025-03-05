const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const {  activityController} = require("../controllers");
const { activityMiddleware, projectMiddleware, siteMiddleware } = require("../middlewares");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");

const activityRouter = express.Router({mergeParams: true});


activityRouter.use(bodyParser.json());
activityRouter.get("/get-by-project-id",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.getActivityByProjectId
)
activityRouter.post("/create",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.createActivity
)
activityRouter.put("/:activityId/edit",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, activityMiddleware.isInActivity],
    activityController.editActivity
)
activityRouter.put("/:activityId/assignMember",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, activityMiddleware.isInActivity],
    activityController.assignMember
)
activityRouter.delete("/:activityId/delete",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject, activityMiddleware.isInActivity],
    activityController.removeActivity
)


module.exports = activityRouter;