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
projectRouter.get("/:projectId/get-project-members",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.getProjectMembersById
)
projectRouter.post("/:projectId/add-project-member",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.addProjectMember
)
projectRouter.put("/:projectId/edit-project-member",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.editProjectMemberRole
)
projectRouter.delete("/:projectId/remove-project-member",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.removeProjectMember
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

projectRouter.delete("/:projectId/destroy",
    authMiddleware.verifyAccessToken,
    projectMiddleware.isInProject,
    projectController.destroyProject
);



projectRouter.post("/create",
    [authMiddleware.verifyAccessToken],
    projectController.createProject
)



module.exports = projectRouter;