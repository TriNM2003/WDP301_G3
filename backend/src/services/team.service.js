const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const { slugify } = require('../utils/slugify.util');


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
    createTeam
}

module.exports = teamService;