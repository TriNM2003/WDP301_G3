const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const { siteMiddleware } = require("../middlewares");
const { teamController } = require("../controllers");
const teamRouter = express.Router({mergeParams: true});
teamRouter.use(bodyParser.json());


teamRouter.get("/team-members", 
    authMiddleware.verifyAccessToken, 
    siteMiddleware.isInSite,
    teamController.getTeamMembers
);


teamRouter.post("/add-team-member", 
    authMiddleware.verifyAccessToken,
    siteMiddleware.isInSite,
    teamController.addTeamMember
);

teamRouter.post("/kick-team-member", 
    authMiddleware.verifyAccessToken, 
    siteMiddleware.isInSite,
    teamController.kickTeamMember
);



module.exports = teamRouter
