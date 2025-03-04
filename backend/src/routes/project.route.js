const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");
const projectRouter = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

projectRouter.use(bodyParser.json());
projectRouter.get("/get-project-id",
    authMiddleware.verifyAccessToken,
    projectController.getProjectById
)
projectRouter.put("/project-setting",
    authMiddleware.verifyAccessToken,
    cloudinary.upload.single("projectAvatar"),
    projectController.editProject
)

module.exports = projectRouter;