const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");

const cloudinary = require("../configs/cloudinary");
const authMiddleware = require("../middlewares/auth.middleware");

const { projectMiddleware, siteMiddleware, } = require("../middlewares");
const { isSiteOwner } = require("../middlewares/site.middleware");
const { isActive } = require("../middlewares/account.middleware");



const projectRouter = express.Router({ mergeParams: true });
projectRouter.use(bodyParser.json());
// check dang nhap va check active
projectRouter.use(authMiddleware.verifyAccessToken)
projectRouter.use(isActive)

projectRouter.get("/trash",
    projectController.getProjectTrash
);

projectRouter.get("/get-all",
    projectController.getAllProjects
)

projectRouter.get("/get-by-site",
    siteMiddleware.isInSite,
    projectController.getProjectsInSite
)
projectRouter.get("/:projectId",
    projectMiddleware.isInProject,

    projectController.getProjectById
)
projectRouter.get("/:projectId/get-project-members",
    [projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.getProjectMembersById
)
projectRouter.post("/:projectId/add-project-member",
    [ projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.addProjectMember
)
projectRouter.put("/:projectId/edit-project-member",
    [ projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.editProjectMemberRole
)
projectRouter.delete("/:projectId/remove-project-member",
    [ projectMiddleware.isInProject, projectMiddleware.isProjectManager],
    projectController.removeProjectMember
)
projectRouter.put("/:projectId/project-setting",
    projectMiddleware.isInProject,
    projectMiddleware.isProjectManager,
    cloudinary.upload.single("projectAvatar"),
    projectController.editProject
)
// for site owner
projectRouter.put("/:projectId/project-setting-v2",
    siteMiddleware.isSiteOwner,
    cloudinary.upload.single("projectAvatar"),
    projectController.editProject
)
projectRouter.put("/:projectId/remove-to-trash",
    projectMiddleware.isInProject,
    projectMiddleware.isProjectManager,
    projectController.removeToTrash
);
// for site owner
projectRouter.put("/:projectId/remove-to-trash-v2",
    siteMiddleware.isSiteOwner,
    projectController.removeToTrash
);

projectRouter.get("/trash",
    projectMiddleware.isInProject,
    projectMiddleware.isProjectManager,
    projectController.getProjectTrash
);

projectRouter.put("/:projectId/restore",
    projectMiddleware.isInProject,
    projectMiddleware.isProjectManager,
    projectController.restoreProject
);

projectRouter.delete("/:projectId/destroy",
    projectMiddleware.isInProject,
    projectMiddleware.isProjectManager,
    projectController.destroyProject
);



projectRouter.post("/create",
    projectController.createProject
)

// for site owner
projectRouter.post("/create-v2",
    isSiteOwner,
    projectController.createProjectV2
)

module.exports = projectRouter;