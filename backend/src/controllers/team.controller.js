const db = require('../models');
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const teamService = require("../services/team.service");
const notificationService = require("../services/notification.service");

const getAllTeams = async (req, res) => {
    try {
        const teams = await teamService.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getTeamMembers = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const members = await teamService.getTeamMembers(teamId);
        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const addTeamMember = async (req, res) => {
    try {
        const { id } = req.payload;
        const { username, email, role } = req.body;
        const teamId = req.params.teamId;

        const checkTeam = await db.Team.findById(teamId).populate("teamMembers._id");
        if (!checkTeam) {
            return res.status(404).json({ error: { status: 404, message: "Team not found" } });
        }
        const result = await teamService.addTeamMember(teamId, username, email, role);

        const user = await db.User.findById(id);
        
        // Gửi thông báo đến tất cả thành viên
        const receivers = checkTeam.teamMembers.map(member => member._id);
        await notificationService.createNotification(
            id,
            receivers,
            `${user?.username} added ${username} to the team ${checkTeam.teamName}.`,
            "team"
        );

        res.status(201).json({ status: 201, message: "User added to team successfully", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const kickTeamMember = async (req, res) => {
    try {
        const {id} = req.payload
        const { userId } = req.body;
        const teamId = req.params.teamId;
        const checkTeam = await db.Team.findById(teamId).populate("teamMembers._id");
        const result = await teamService.kickTeamMember(teamId, userId);
        const user = await db.User.findById(userId);
        const teamLead = await db.User.findById(id);

        if (!checkTeam) {
            return res.status(404).json({ error: { status: 404, message: "Team not found" } });
        }
        
        // Gửi thông báo đến tất cả thành viên còn lại
        const receivers = checkTeam.teamMembers.map(member => member._id).filter(id => id.toString() !== userId);
        await notificationService.createNotification(
            id,
            receivers,
            `${teamLead?.username} removed ${user?.username} from the team ${checkTeam.teamName}.`,
            "team"
        );
        res.status(200).json({ status: 200, message: "User removed from team successfully", result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const sendEmailNotification = async (email, teamName) => {
    const viewTeam = `http://localhost:3000/site/team`;
   const transporter = nodemailer.createTransport({
               service: "gmail",
               auth: {
                   user: process.env.EMAIL_USER,
                   pass: process.env.EMAIL_PASS,
               },
           });
   
           const mailOptions = {
               from: process.env.EMAIL_USER,
               to: email,
               subject: "You've been added to a team!",
               html: `
                <h2>Welcome to ${teamName} team!</h2>
                <p>You have been successfully added to the team: ${teamName}. Welcome aboard!</p>
                <p>Click to view team:</p>
                <a href="${viewTeam}"
                   style="padding: 10px 20px; background: blue; color: #fff; text-decoration: none; border-radius: 5px;">
                     View Team
                </a>
            `,
           };
   
           await transporter.sendMail(mailOptions);
};

const getTeamsInSite = async (req, res, next) => {
    try {
        const { siteId } = req.params;

        const teams = await teamService.getTeamsInSite(siteId); 
        if (!teams || teams.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "Team not found" } });
        }

    const populateTeams = await db.User.populate(teams, {
                path: "teamMembers._id",
                select: "username userAvatar email fullName"
            });


        res.status(200).json(populateTeams);
    } catch (error) {
        next(error);
    }
};

// create team 

const createTeam = async (req, res, next) => {
    try {
        const creatorId = req.payload.id;
        const siteId = req.params.siteId;

        const newTeam = await teamService.createTeam(req.body, creatorId, siteId);

        res.status(201).json({
            message: "Project created successfully!",
            team: newTeam
        });
    } catch (error) {
        res.status(400).json({ error: { status: 400, message: error.message } });
    }
};

// get team activities

const getTeamActivities = async (req, res, next) => {
    try {
        const { teamSlug } = req.params;

        const activities = await teamService.getTeamActivities(teamSlug);

        if (!activities || activities.length === 0) {
            return res.status(404).json({ error: { status: 404, message: "No activities found for this team" } });
        }

        res.status(200).json({ status: 200, activities });
    } catch (error) {
        next(error);
    }
};

async function removeTeam(req, res, next){
    try {
        // id cua site owner
        const {id} = req.payload
        const {teamId} = req.params;
        const result = await teamService.removeTeam(id, teamId)
        res.status(200).json({ status: 200, result });
    } catch (error) {
        next(error)
    }
}


const teamController = {
    getAllTeams,
    getTeamMembers,
    addTeamMember,
    kickTeamMember,
    getTeamsInSite,
    createTeam,
    getTeamActivities,
    removeTeam,
};

module.exports = teamController;