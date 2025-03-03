const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const siteRouter = express.Router();
const cloudinary = require("../configs/cloudinary");

siteRouter.use(bodyParser.json());

siteRouter.get("/:id",verifyAccessToken, SiteController.getSiteById)
siteRouter.post("/create", verifyAccessToken, cloudinary.upload.single("siteAvatar"), SiteController.createSite)


module.exports = siteRouter;