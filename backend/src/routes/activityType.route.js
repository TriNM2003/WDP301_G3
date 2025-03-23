const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const activityTypeController = require("../controllers/activityType.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { accountMiddleware, siteMiddleware, projectMiddleware } = require("../middlewares");


const activityTypeRouter = express.Router();


activityTypeRouter.use(bodyParser.json());
activityTypeRouter.get("/get-all",
[authMiddleware.verifyAccessToken,accountMiddleware.isActive],
    activityTypeController.getAllActivityTypes
)

module.exports = activityTypeRouter;