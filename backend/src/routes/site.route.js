const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const cloudinary = require("../configs/cloudinary");
const db = require("../models/index");
const { siteController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const siteRouter = express.Router({mergeParams: true});

siteRouter.use(bodyParser.json());

siteRouter.get("/get-all", [verifyAccessToken, adminMiddleware.isAdmin], siteController.getAllSites)
siteRouter.get("/:siteId/get-by-id",verifyAccessToken, SiteController.getSiteById)
siteRouter.get("/:siteId/get-site-members", 
    // [verifyAccessToken],
    siteController.getSiteMembersById
    )
siteRouter.post("/create", [verifyAccessToken, adminMiddleware.isAdmin],cloudinary.upload.single("userAvatar"), SiteController.createSite)
siteRouter.get("/get-by-user-id",
    [authMiddleware.verifyAccessToken],
    siteController.getSiteByUserId
)
// siteRouter.post("/invite-member", verifyAccessToken, siteController.inviteMembersByEmail)

module.exports = siteRouter;
