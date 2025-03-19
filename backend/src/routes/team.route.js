const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");
const { siteMiddleware } = require("../middlewares");
const { teamController } = require("../controllers");
const teamRouter = express.Router({mergeParams: true});
teamRouter.use(bodyParser.json());

teamRouter.get("/teams", 
    authMiddleware.verifyAccessToken, 
    accountMiddleware.isActive,
    siteMiddleware.isInSite,
    teamController.getAllTeams
);

teamRouter.get("/:teamId/team-members", 
    authMiddleware.verifyAccessToken, 
    accountMiddleware.isActive,
    siteMiddleware.isInSite,
    teamController.getTeamMembers
);


teamRouter.post("/:teamId/add-team-member", 
    authMiddleware.verifyAccessToken,
    accountMiddleware.isActive,
    siteMiddleware.isInSite,
    teamController.addTeamMember
);

teamRouter.post("/:teamId/kick-team-member", 
    authMiddleware.verifyAccessToken, 
    accountMiddleware.isActive,
    siteMiddleware.isInSite,
    teamController.kickTeamMember
);

// get team in site
teamRouter.get("/get-teams-in-site", 
    authMiddleware.verifyAccessToken,
    teamController.getTeamsInSite
);

// create team 
teamRouter.post("/create-team", 
    authMiddleware.verifyAccessToken, 
    teamController.createTeam
);

// get team activites
teamRouter.get("/:teamSlug", 
    authMiddleware.verifyAccessToken, 
    teamController.getTeamActivities
);

//delete team
teamRouter.delete("/:teamId/remove-team",
    [authMiddleware.verifyAccessToken, siteMiddleware.isInSite, siteMiddleware.isSiteOwner,],
    teamController.removeTeam
)


module.exports = teamRouter
