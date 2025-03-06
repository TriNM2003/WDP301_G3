const db = require('../models');
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const getTeamMembers = async (req, res) => {
    try {
        const  teamId  = '67c5263a1584be9f82734433';

        // Kiểm tra xem team có tồn tại không
        const team = await db.Team.findById(teamId).populate("teamMembers._id");

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Lấy thông tin team members
        const members = team.teamMembers.map(member => {
            return {
                _id: member._id._id,
                username: member._id.username,
                email: member._id.email,
                fullName: member._id.fullName,
                userAvatar: member._id.userAvatar || "default.jpg",
                role: member.roles.length > 0 ? member.roles[0] : "teamMember",
                dateAdded: team.createdAt
            };
        });

        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const addTeamMember = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const teamId = '67c5263a1584be9f82734433';

        // Kiểm tra xem team có tồn tại không
        const team = await db.Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Tìm user trong site theo username hoặc email
        const site = await db.Site.findById(team.site).populate("siteMember._id");
        if (!site) {
            return res.status(404).json({ message: "Site not found" });
        }

        let user = site.siteMember.find(member => 
            (username && member._id.username === username) || 
            (email && member._id.email === email)
        );

        if (!user) {
            return res.status(404).json({ message: "User not found in site members" });
        }

        user = user._id;

        // Kiểm tra xem user đã là thành viên của team chưa
        const isMember = team.teamMembers.some(member => member._id.toString() === user._id.toString());
        if (isMember) {
            return res.status(400).json({ message: "User is already a member of the team" });
        }

        // Thêm user vào team
        team.teamMembers.push({ _id: user._id, roles: [role || 'teamMember'] });
        await team.save();

        // Thêm teamId vào user
        user.teams.push(team._id);
        await user.save();

        // Gửi email thông báo
        await sendEmailNotification(user.email, team.teamName, "added");

        res.status(200).json({ message: "User added to the team and email sent", userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const kickTeamMember = async (req, res) => {
    try {
        console.log("Kick API called, Body:", req.body);
        
        const { userId } = req.body;
        console.log("UserId received:", userId);
        const teamId = '67c5263a1584be9f82734433';

        // Kiểm tra xem team có tồn tại không
        const team = await db.Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // Kiểm tra xem user có trong team không
        const isMember = team.teamMembers.find(member => member._id.toString() === userId);
        if (!isMember) {
            return res.status(404).json({ message: "User is not a member of this team" });
        }

        // Xóa user khỏi team
        team.teamMembers = team.teamMembers.filter(member => member._id.toString() !== userId);
        await team.save();

        // Xóa teamId khỏi user
        const user = await db.User.findById(userId);
        user.teams = user.teams.filter(team => team.toString() !== teamId);
        await user.save();

        // Tìm email của user để gửi thông báo
        if (user) {
            await sendEmailNotification(user.email, team.teamName, "removed");
        }

        res.status(200).json({ message: "User kicked from the team" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
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
                <a href="${viewTeam}"
                   style="padding: 10px 20px; background: blue; color: #fff; text-decoration: none; border-radius: 5px;">
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





const teamController = {
    getTeamMembers,
    addTeamMember,
    kickTeamMember
};

module.exports = teamController;
