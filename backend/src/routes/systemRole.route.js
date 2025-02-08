const express = require("express");
const systemRoleRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { SystemRoleController } = require("../controllers");


systemRoleRouter.use(bodyParser.json());
systemRoleRouter.get("/get-all",
    SystemRoleController.getAllSystemRoles
)

module.exports = systemRoleRouter