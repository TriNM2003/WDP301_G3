const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const nodemailer = require("nodemailer");
const { slugify } = require('../utils/slugify.util');

const getAllTeams = async () => {
    const teams = await db.Team.find();
    return teams;
}

const getTeamById = async (teamId) => {
    const team = await db.Team.findById(teamId).populate("teamMembers._id");
    if (!team) {
        throw new Error("Team not found");
    }
    return team;
};

const getTeamMembers = async (teamId) => {
    try {
        const team = await getTeamById(teamId);

        return team.teamMembers
        .filter(member => member._id.status === "active") // Lọc chỉ lấy thành viên active
        .map(member => ({
            _id: member._id._id,
            username: member._id.username,
            email: member._id.email,
            fullName: member._id.fullName,
            userAvatar: member._id.userAvatar || "default.jpg",
            role: member.roles.length > 0 ? member.roles[0] : "teamMember",
            dateAdded: team.createdAt
        }));
    } catch (error) {
        throw error;
    }
};

const addTeamMember = async (teamId, username, email, role) => {
    try {
        const team = await getTeamById(teamId);

        const site = await db.Site.findById(team.site).populate("siteMember._id");
        if (!site) throw new Error("Site not found");

        let user = site.siteMember.find(member =>
            (username && member._id.username === username) ||
            (email && member._id.email === email)
        );

        if (!user) throw new Error("User not found in site members");
        user = user._id;

        const isMember = team.teamMembers.some(member => member._id.toString() === user._id.toString());
        if (isMember) throw new Error("User is already a member of the team");

        await db.Team.updateOne(
            { _id: teamId },
            { $push: { teamMembers: { _id: user._id, roles: [role] } } }
        );

        await db.User.updateOne(
            { _id: user._id },
            { $push: { teams: teamId } }
        );

        await sendEmailNotification(user.email, team.teamName, "added");

        return { message: "User added to the team and email sent", userId: user._id };
    } catch (error) {
        throw error;
    }
};

const kickTeamMember = async (teamId, userId) => {
    try {
        const team = await getTeamById(teamId);

        const isMember = team.teamMembers.find(member => member._id._id.toString() === userId);
        if (!isMember) throw new Error("User is not a member of this team");

        team.teamMembers = team.teamMembers.filter(member => member._id._id.toString() !== userId);
        await db.Team.updateOne(
            { _id: teamId },
            { $set: { teamMembers: team.teamMembers } }
        );

        const user = await db.User.findById(userId);
        if (user) {
            user.teams = user.teams.filter(team => team.toString() !== teamId);
            await db.User.updateOne(
                { _id: userId },
                { $set: { teams: user.teams } }
            );
            await sendEmailNotification(user.email, team.teamName, "removed");
        }

        return { message: "User kicked from the team" };
    } catch (error) {
        throw error;
    }
};

const sendEmailNotification = async (email, teamName, action) => {
    const viewTeam = `http://localhost:3000/site/team`;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions;
    if (action === "added") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "You've been added to a team!",
            html: `
                <h2>Welcome to ${teamName} team!</h2>
                <p>You have been successfully added to the team: <strong>${teamName}</strong>. Welcome aboard!</p>
                <p>Click below to view your team:</p>
                <a href="${viewTeam}" style="padding: 10px 20px; background: blue; color: #fff; text-decoration: none; border-radius: 5px;">
                    View Team
                </a>
            `,
        };
    } else if (action === "removed") {
        mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Team Notification: You have been removed from ${teamName}`,
            html: `
                <h2>Team Notification</h2>
                <p>Dear user,</p>
                <p>You have been <strong>removed</strong> from the team: <strong>${teamName}</strong>.</p>
            `,
        };
    } else {
        console.error("Invalid action for email notification");
        return;
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email} regarding ${action} in ${teamName}`);
    } catch (error) {
        console.error("Error sending email notification:", error);
    }
};


const getTeamsInSite = async(siteId)=>{
    try {
        const team = await db.Team.find({site:siteId})
        return team;
    } catch (error) {
        throw error;
    }
}

// create team
const createTeam = async (teamData, creatorId, siteId) => {
    try {
        // Tìm site và populate siteMember để lấy danh sách thành viên hợp lệ
        const site = await db.Site.findById(siteId).populate({
            path: "siteMember._id",
            select: "_id"
        });

        if (!site) {
            throw new Error("Site not found");
        }

        // Lấy danh sách ID của các thành viên hợp lệ trong site
        const siteMemberIds = site.siteMember.map(member => member._id?._id.toString());

        // Kiểm tra xem tất cả teamMembers có thuộc site không
        const isValidMembers = teamData.teamMembers.every(memberId => 
            siteMemberIds.includes(memberId.toString())
        );
        if (!isValidMembers) {
            throw new Error("Some members are not part of the site");
        }
        const teamSlug = slugify(teamData.teamName);

        // Định dạng danh sách teamMembers
        const teamMembers = [
            { _id: creatorId, roles: ["teamLeader"] }, 
            ...(teamData.teamMembers?.map(memberId => ({
                _id: memberId,
                roles: ["teamMember"]
            })) || [])
        ];

        // Tạo team mới
        const newTeam = new db.Team({
            teamName: teamData.teamName,
            teamSlug: teamSlug,
            teamDescription: teamData.teamDescription || "",
            teamRoles: teamData.teamRoles || ["teamLeader", "teamMember"],
            teamMembers: teamMembers,
            site: siteId,
            teamAvatar: teamData.teamAvatar || "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",
        });

        const savedTeam = await newTeam.save();

        // Cập nhật danh sách teams của user trong model User
        const memberIds = teamMembers.map(member => member._id);
        await db.User.updateMany(
            { _id: { $in: memberIds } },
            { $push: { teams: savedTeam._id } }
        );

        return savedTeam;
    } catch (error) {
        throw error;
    }
};



const teamService = {
    getTeamsInSite,
    createTeam,
    getAllTeams,
    getTeamById,
    getTeamMembers,
    addTeamMember,
    kickTeamMember,
};

module.exports = teamService;