const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { activityController } = require("../controllers");
const { activityMiddleware, projectMiddleware, siteMiddleware } = require("../middlewares");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");
const { cloudinary } = require("../configs");

const activityRouter = express.Router({ mergeParams: true });


activityRouter.use(bodyParser.json());
activityRouter.get("/get-by-project-id",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.getActivityByProjectId
)
activityRouter.get("/:activityId/get-by-id",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.getById
)
activityRouter.post("/create",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject,activityMiddleware.isNotDone],
    activityController.createActivity
)
activityRouter.put("/:activityId/edit",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject, activityMiddleware.isInActivity,activityMiddleware.isNotDone],
    activityController.editActivity
)
activityRouter.put("/:activityId/upload",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject, activityMiddleware.isInActivity,activityMiddleware.isNotDone],
    cloudinary.upload.single("attachment"),
    activityController.uploadAttachment
)
activityRouter.put("/:activityId/move",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.moveActivity
)
activityRouter.put("/:activityId/assignMember",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject,activityMiddleware.isNotDone],
    activityController.assignMember
)
activityRouter.put("/:activityId/removeAssignee",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject,activityMiddleware.isNotDone],
    activityController.removeAssignMember
)
activityRouter.delete("/:activityId/delete",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.removeActivity
)

//Comment 
activityRouter.post("/:activityId/comments/post",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.createComment
)
activityRouter.get("/:activityId/comments/get-all",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.getAllComment
)
activityRouter.put("/:activityId/comments/:commentId/edit",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.editComment
)
activityRouter.delete("/:activityId/comments/:commentId/delete",
    [authMiddleware.verifyAccessToken, accountMiddleware.isActive, siteMiddleware.isInSite, projectMiddleware.isInProject],
    activityController.deleteComment
)


module.exports = activityRouter;