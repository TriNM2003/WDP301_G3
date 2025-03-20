const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const sprintController = require("../controllers/sprint.controller");
const { activityMiddleware, projectMiddleware, siteMiddleware, accountMiddleware } = require("../middlewares");
const authMiddleware = require("../middlewares/auth.middleware");
const sprintMiddleware = require("../middlewares/sprint.middleware");

const sprintRouter = express.Router({mergeParams: true});

sprintRouter.get("/get-by-project",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject],
    sprintController.getByProjectId
)

sprintRouter.post("/create",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject,projectMiddleware.isProjectManager],
    sprintController.createSprint
)

sprintRouter.put("/:sprintId/edit",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject,projectMiddleware.isProjectManager,sprintMiddleware.isNotCompletedSprint],
    sprintController.editSprint
)

sprintRouter.put("/:sprintId/complete",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject,projectMiddleware.isProjectManager],
    sprintController.completeSprint
)
sprintRouter.put("/:sprintId/delete",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive,siteMiddleware.isInSite, projectMiddleware.isInProject,projectMiddleware.isProjectManager],
    sprintController.deleteSprint
)



sprintRouter.use(bodyParser.json());
module.exports = sprintRouter;