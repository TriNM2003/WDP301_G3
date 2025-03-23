const bodyParser = require("body-parser");
const express = require("express");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const SiteController = require("../controllers/site.controller");
const cloudinary = require("../configs/cloudinary");
const db = require("../models/index");
const { siteController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const siteMiddleware = require("../middlewares/site.middleware");
const {isActive} = require("../middlewares/account.middleware")
const { siteService } = require("../services");
const siteRouter = express.Router({mergeParams: true});

siteRouter.use(bodyParser.json());

// ko can middleware
siteRouter.post("/processing-invitation", siteController.processingInvitation) //hung

// middleware dung chung cho tat ca cac site route
siteRouter.use([verifyAccessToken,isActive]);


siteRouter.get("/get-all", adminMiddleware.isAdmin, siteController.getAllSites)  //hung
siteRouter.get("/:siteId/get-by-id", SiteController.getSiteById) //hung
siteRouter.get("/:siteId/get-site-members", siteMiddleware.isInSite, siteController.getSiteMembersById) //hung
siteRouter.post("/create",adminMiddleware.isAdmin, SiteController.createSite)  //hung
siteRouter.post("/:siteId/invite-member", siteMiddleware.isInSite, siteController.inviteMemberByEmail) //hung
siteRouter.delete("/:siteId/revoke-site-member-access/:siteMemberId", [ siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.revokeSiteMemberAccess) //hung
siteRouter.put("/:siteId/edit",
    siteMiddleware.isInSite,
    cloudinary.upload.single("siteAvatar"),
    siteController.editSite
);

siteRouter.post("/:siteId/send-deactivate-email",
    [siteMiddleware.isInSite, siteMiddleware.isSiteOwner],
    siteController.sendDeactivateSiteEmail
)

siteRouter.put("/:siteId/deactivate",
    [siteMiddleware.isInSite],
    siteController.deactivateSite
);
// for admin
siteRouter.put("/:siteId/adminDeactivate",
    [adminMiddleware.isAdmin],
    siteController.deactivateSite,
);
siteRouter.get("/:siteId/get-invitations-by-site",[siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.getInvitaionsBySiteId); //hung
siteRouter.delete("/:siteId/cancel-Invitation",[siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.cancelInvitationById);

siteRouter.get("/get-by-user-id",
    siteController.getSiteByUserId
)

// get all user in site
siteRouter.get("/:siteId/members", siteController.getAllUsersInSite)
siteRouter.put("/:siteId/active", adminMiddleware.isAdmin, siteController.activeSite);
siteRouter.put("/:siteId/adminEdit", adminMiddleware.isAdmin, siteController.adminEditSite);

siteRouter.put("/:siteId/change-site-member-roles", [ siteMiddleware.isInSite, siteMiddleware.isSiteOwner], siteController.changeSiteMemberRoles)

module.exports = siteRouter;
