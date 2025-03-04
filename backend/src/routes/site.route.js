const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const siteRouter = express.Router();
const cloudinary = require("../configs/cloudinary");
const db = require("../models/index");
const { siteController } = require("../controllers");

siteRouter.use(bodyParser.json());

siteRouter.get("/all", verifyAccessToken, siteController.getAllSites)
siteRouter.get("/:id",verifyAccessToken, SiteController.getSiteById)
siteRouter.post("/create", verifyAccessToken, cloudinary.upload.single("siteAvatar"), SiteController.createSite)
siteRouter.get("/get-by-user-id",
    siteController.getSiteByUserId
)
siteRouter.post("/invite", verifyAccessToken, siteController.inviteMembersByEmail)

module.exports = siteRouter;
