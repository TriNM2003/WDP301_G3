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

const inviteMembersByEmail = async (sender, receiverEmails, receiverIds, siteName, siteId) => {
   

    return "Invitation emails send successfully!"
}

const siteService = {
    getSiteById,
    createSite,
    getSiteByUserId,
    inviteMembersByEmail,
    getAllSites,
    getSiteMembersById,
}

module.exports = siteService;
