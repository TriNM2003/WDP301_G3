const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const { teamController } = require("../controllers");
const teamRouter = express.Router({mergeParams: true});
teamRouter.use(bodyParser.json());


teamRouter.get("/team-members", 
    authMiddleware.verifyAccessToken, 
    teamController.getTeamMembers
);


teamRouter.post("/add-team-member", 
    authMiddleware.verifyAccessToken, 
    teamController.addTeamMember
);

teamRouter.post("/kick-team-member", 
    authMiddleware.verifyAccessToken, 
    teamController.kickTeamMember
);



module.exports = teamRouter
