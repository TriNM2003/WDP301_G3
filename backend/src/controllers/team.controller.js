const teamService = require("../services/team.service");

const getTeamMembers = async (req, res) => {
    try {
        const teamId = "67c5263a1584be9f82734433";
        const members = await teamService.getTeamMembers(teamId);
        res.status(200).json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const addTeamMember = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const teamId = "67c5263a1584be9f82734433";
        const result = await teamService.addTeamMember(teamId, username, email, role);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const kickTeamMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const teamId = "67c5263a1584be9f82734433";
        const result = await teamService.kickTeamMember(teamId, userId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const teamController = {
    getTeamMembers,
    addTeamMember,
    kickTeamMember,
};

module.exports = teamController;