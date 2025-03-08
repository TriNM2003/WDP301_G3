const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");

const cloudinary = require("../configs/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");
const { projectMiddleware, siteMiddleware } = require("../middlewares");


const projectRouter = express.Router({ mergeParams: true });
projectRouter.use(bodyParser.json());

projectRouter.get("/trash",
    authMiddleware.verifyAccessToken,
    projectController.getProjectTrash
);


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
projectRouter.put("/:projectId/project-setting",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    cloudinary.upload.single("projectAvatar"),
    projectController.editProject
)
projectRouter.put("/:projectId/remove-to-trash",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    projectController.removeToTrash
);

projectRouter.get("/trash",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    projectController.getProjectTrash
);

projectRouter.put("/:projectId/restore",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    projectController.restoreProject
);

projectRouter.delete("/:projectId/delete",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    projectController.deleteProject
);



projectRouter.post("/create",
    [authMiddleware.verifyAccessToken],
    projectController.createProject
)



module.exports = projectRouter;