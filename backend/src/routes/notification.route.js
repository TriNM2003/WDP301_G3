const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { notificationController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const { accountMiddleware } = require("../middlewares");


const notificationRouter = express.Router();
notificationRouter.use([authMiddleware.verifyAccessToken, accountMiddleware.isActive])

notificationRouter.get("/get-all",
    notificationController.getAlls
)
notificationRouter.put("/:notificationId/is-seen",
    notificationController.isSeen
)

notificationRouter.use(bodyParser.json());


module.exports = notificationRouter;