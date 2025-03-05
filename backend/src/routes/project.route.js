const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");

const projectRouter = express.Router({mergeParams: true});
projectRouter.use(bodyParser.json());

projectRouter.get("/trash",
    authMiddleware.verifyAccessToken,
    projectController.getProjectTrash
);

projectRouter.get("/:projectId",
    authMiddleware.verifyAccessToken,
    projectController.getProjectById
)
projectRouter.put("/:projectId/project-setting",
    authMiddleware.verifyAccessToken,
    cloudinary.upload.single("projectAvatar"),
    projectController.editProject
)
projectRouter.put("/:projectId/remove-to-trash",
    authMiddleware.verifyAccessToken,
    projectController.removeToTrash
);

projectRouter.get("/trash",
    authMiddleware.verifyAccessToken,
    projectController.getProjectTrash
);

projectRouter.put("/:projectId/restore",
    authMiddleware.verifyAccessToken,
    projectController.restoreProject
);

projectRouter.delete("/:projectId",
    authMiddleware.verifyAccessToken,
    projectController.deleteProject
);

// projectRouter.get("/:projectId/check-manager",
//     authMiddleware.verifyAccessToken,
//     projectController.checkProjectManager
// );

module.exports = projectRouter;