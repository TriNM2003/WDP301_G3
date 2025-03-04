const express = require("express");
const teamRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const { TeamController } = require("../controllers");

teamRouter.use(bodyParser.json());

teamRouter.get("/team-members", 
    authMiddleware.verifyAccessToken, 
    TeamController.getTeamMembers
);

teamRouter.post("/add-team-member", 
    authMiddleware.verifyAccessToken, 
    TeamController.addTeamMember
);

teamRouter.post("/kick-team-member", 
    authMiddleware.verifyAccessToken, 
    TeamController.kickTeamMember
);



module.exports = teamRouter