const db = require('../models');
const nodemailer = require("nodemailer");

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

        return team.teamMembers.map(member => ({
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

        team.teamMembers.push({ _id: user._id, roles: [role || 'teamMember'] });
        await team.save();

        user.teams.push(team._id);
        await user.save();

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
        await team.save();

        const user = await db.User.findById(userId);
        if (user) {
            user.teams = user.teams.filter(team => team.toString() !== teamId);
            await user.save();
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

const teamService = {
    getAllTeams,
    getTeamById,
    getTeamMembers,
    addTeamMember,
    kickTeamMember,
};

module.exports = teamService;