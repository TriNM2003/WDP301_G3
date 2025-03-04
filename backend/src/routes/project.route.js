const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { projectController } = require("../controllers");

const projectRouter = express.Router();


projectRouter.use(bodyParser.json());
projectRouter.get("/get-by-id/:projectId",
    projectController.getProjectById
)

module.exports = projectRouter;