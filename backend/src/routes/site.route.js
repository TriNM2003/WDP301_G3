const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const cloudinary = require("../configs/cloudinary");
const db = require("../models/index");
const { siteController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const siteMiddleware = require("../middlewares/site.middleware");
const { siteService } = require("../services");
const siteRouter = express.Router({mergeParams: true});

siteRouter.use(bodyParser.json());



siteRouter.get("/get-all", [verifyAccessToken, adminMiddleware.isAdmin], siteController.getAllSites)  //hung
siteRouter.get("/:siteId/get-by-id",verifyAccessToken, SiteController.getSiteById) //hung
siteRouter.get("/:siteId/get-site-members", [verifyAccessToken, siteMiddleware.isInSite], siteController.getSiteMembersById) //hung
siteRouter.post("/create", [verifyAccessToken, adminMiddleware.isAdmin], SiteController.createSite)  //hung
siteRouter.post("/:siteId/invite-member", [verifyAccessToken, siteMiddleware.isInSite], siteController.inviteMemberByEmail) //hung
siteRouter.post("/processing-invitation", siteController.processingInvitation) //hung
siteRouter.delete("/:siteId/revoke-site-member-access/:siteMemberId", [verifyAccessToken, siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.revokeSiteMemberAccess) //hung
siteRouter.get("/:siteId/get-invitations-by-site",[verifyAccessToken, siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.getInvitaionsBySiteId); //hung
siteRouter.delete("/:siteId/cancel-Invitation",[verifyAccessToken, siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.cancelInvitationById);

siteRouter.get("/get-by-user-id",
    [authMiddleware.verifyAccessToken],
    siteController.getSiteByUserId
)

// get all user in site
siteRouter.get("/:siteId/members", verifyAccessToken, siteController.getAllUsersInSite)

module.exports = siteRouter;
