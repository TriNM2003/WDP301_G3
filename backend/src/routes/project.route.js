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
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    projectController.getProjectMembersById
)
projectRouter.post("/:projectId/add-project-member",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    projectController.addProjectMember
)
projectRouter.delete("/:projectId/remove-project-member",
    [authMiddleware.verifyAccessToken, projectMiddleware.isInProject],
    projectController.removeProjectMember
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


projectRouter.post("/create",
    [authMiddleware.verifyAccessToken],
    projectController.createProject
)



module.exports = projectRouter;