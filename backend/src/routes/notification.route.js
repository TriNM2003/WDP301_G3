const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { notificationController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const { accountMiddleware } = require("../middlewares");


const notificationRouter = express.Router();
notificationRouter.get("/get-all",
    [authMiddleware.verifyAccessToken,accountMiddleware.isActive],
    notificationController.getAlls
)

notificationRouter.use(bodyParser.json());


module.exports = notificationRouter;