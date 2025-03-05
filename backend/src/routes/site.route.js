const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const siteRouter = express.Router();
const cloudinary = require("../configs/cloudinary");
const db = require("../models/index");
const { siteController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

siteRouter.use(bodyParser.json());

siteRouter.get("/all", verifyAccessToken, siteController.getAllSites)
siteRouter.get("/:siteId/get-by-id",verifyAccessToken, SiteController.getSiteById)
siteRouter.get("/get-by-user-id",
    [authMiddleware.verifyAccessToken],
    siteController.getSiteByUserId
);
siteRouter.post("/create", verifyAccessToken, cloudinary.upload.single("siteAvatar"), SiteController.createSite)

// get all user in site
siteRouter.get("/:siteId/members", verifyAccessToken, siteController.getAllUsersInSite)

siteRouter.post("/invite", verifyAccessToken, siteController.inviteMembersByEmail)

module.exports = siteRouter;
