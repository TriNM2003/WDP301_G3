const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");
const { siteMiddleware } = require("../middlewares");
const { teamController } = require("../controllers");
const teamRouter = express.Router({mergeParams: true});
teamRouter.use(bodyParser.json());

teamRouter.use(authMiddleware.verifyAccessToken);
teamRouter.use(accountMiddleware.isActive);
teamRouter.use(siteMiddleware.isInSite);

teamRouter.get("/teams", 
    teamController.getAllTeams
);

teamRouter.get("/:teamId/team-members", 
    teamController.getTeamMembers
);


teamRouter.post("/:teamId/add-team-member", 
    teamController.addTeamMember
);

teamRouter.post("/:teamId/kick-team-member", 
    teamController.kickTeamMember
);

// get team in site
teamRouter.get("/get-teams-in-site", 
    teamController.getTeamsInSite
);

// create team 
teamRouter.post("/create-team", 
    teamController.createTeam
);

// get team activites
teamRouter.get("/:teamSlug", 
    teamController.getTeamActivities
);

//delete team
teamRouter.delete("/:teamId/remove-team",
    siteMiddleware.isSiteOwner,
    teamController.removeTeam
)


module.exports = teamRouter
