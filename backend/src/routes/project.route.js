const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { ProjectController } = require("../controllers");


projectRouter.use(bodyParser.json());
projectRouter.get("/getById",
    ProjectController.getProjectById
)

module.exports = projectRouter