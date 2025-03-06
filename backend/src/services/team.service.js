const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");


const getTeamById = async (teamId) => {
   const team = await db.Team.findById(teamId).populate("teamMembers");
    if(!team){
         throw new Error("No team found");
    }
    return team;
};

const teamService = {
    getTeamById
}
module.exports = teamService;