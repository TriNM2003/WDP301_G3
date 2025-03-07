const Site = require("../models/site.model");
const fs = require("fs")
const {cloudinary} = require('../configs/cloudinary');
const cloudinaryFile = require('../configs/cloudinary');
const path = require('path');
const { User } = require("../models");
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const nodemailer = require("nodemailer")
const {slugify} = require("../utils/slugify.util")


const getAllSites= async () => {
    const sites = await Site.find({}).populate("siteMember._id");
    return sites;
}

const getSiteById = async (id) => {
    const site = await Site.findById(id).populate("siteMember._id");
    if(!site){
        throw new Error("No site found");
    }
    return site;
}

const getSiteMembersById = async (id) => {
    const site = await Site.findById(id).populate("siteMember._id");
    if(!site){
        throw new Error("No site found");
    }
    return site.siteMember;
}

const createSite = async (requestData, imageFile) => {
    const siteOwner = await User.findOne({email: requestData.siteOwner});
    //check user co site chua
    const siteCheck2 = await Site.findOne({siteMember: {$elemMatch: {_id: siteOwner._id}}});
    if(siteCheck2){
        throw new Error("Each user can only have 1 site");
    }

    //check site name
    const siteCheck1 = await Site.findOne({siteName: requestData.siteName});
    if(siteCheck1){
        throw new Error("Site name already taken, please choose another name");
    }

    let siteAvatar;
     // Kiểm tra nếu có ảnh được tải lên
    if (imageFile !== null) {
        try {
            const result = await cloudinary.uploader.upload(imageFile.path);
            if (result && result.secure_url) {
                siteAvatar = result.secure_url;
                // Xóa ảnh cục bộ sau khi upload thành công
                fs.unlink(imageFile.path, (err) => {
                    if (err) console.error("Error deleting local file:", err);
                });
            } else {
                return res.status(500).json({ message: "Failed to upload image" });
            }
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            fs.unlink(imageFile.path, () => { });
            return res.status(500).json({ message: "Image capacity is too large!" });
        }
    }

    // tao site moi
    const newSite = await Site.insertOne({
        siteName: requestData.siteName,
        siteRoles: ["siteOwner", "siteMember"],
        siteMember: [{
            _id: siteOwner._id,
            roles: ["siteOwner"]
        }],
        siteAvatar: siteAvatar,
        siteDescription: requestData.siteDescription,
        siteSlug: slugify(requestData.siteName)
    });

    // cap nhap site cua user
    siteOwner.site = newSite._id;
    await siteOwner.save()

    return newSite;
}

const getSiteByUserId = async(userId) => {
    try {
        const site = await db.Site.findOne({
            "siteMember._id": userId
        });
        return site;
    } catch (error) {
        throw error;
    }
}

// get all user in site
const getAllUsersInSite = async (siteId) => {
    try {
        
        const site = await db.Site.findById(siteId).populate({
            path: "siteMember._id",
            select: "username email userAvatar fullName"
        });

        if (!site) {
            throw new Error("Site not found");
        }

       
        return site.siteMember.map(member => ({
            _id: member._id._id,
            username: member._id.username,
            email: member._id.email,
            userAvatar: member._id.userAvatar,
            fullName: member._id.fullName,
            roles: member.roles
        }));
    } catch (error) {
        throw error;
    }
};



const inviteMembersByEmail = async (sender, receiverEmails, receiverIds, siteName, siteId) => {
   

    return "Invitation emails send successfully!"
}

const revokeSiteMemberAccess = async (siteId, siteMemberId) => {
    const site = await Site.findById(siteId);
    if(!site){
        throw new Error("Site does not exist!");
    }

     // Kiểm tra nếu user có activity chưa hoàn thành
     const activeTasks = await db.Activity.find({
        assignee: siteMemberId,
    }).populate("stage");

    // Lọc ra các activity chưa hoàn thành
    const incompleteActivities = activeTasks.filter(activity => activity.stage.stageStatus !== "done");

    if (incompleteActivities.length > 0) {
        throw new Error(`User ${siteMemberId} still has ${incompleteActivities.length} incomplete activities.`);
    }

    site.siteMember = site.siteMember.filter(member => member._id.toString() !== siteMemberId);
    const updatedSite = await site.save();

    return {
        message:`Revoke site memeber ${siteMemberId} from site ${siteId} successfully!`,
        site: updatedSite
    };
}

const siteService = {
    getSiteById,
    createSite,
    getSiteByUserId,
    inviteMembersByEmail,
    getAllSites,
    revokeSiteMemberAccess,
    getSiteMembersById,

    getAllUsersInSite

}

module.exports = siteService;
