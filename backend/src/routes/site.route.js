const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { siteController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const siteRouter = express.Router();


siteRouter.use(bodyParser.json());
siteRouter.get("/get-by-user-id",
    [authMiddleware.verifyAccessToken],
    siteController.getSiteByUserId
)

module.exports = siteRouter;