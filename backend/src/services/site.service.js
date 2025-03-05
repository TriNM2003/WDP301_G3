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
    return site;
}

const getSiteMembersById = async (id) => {
    const site = await Site.findById(id).populate("siteMember._id");
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

// const inviteMembersByEmail = async (sender, receiverEmails, receiverIds, siteName, siteId) => {
//     const acceptUrl = `http://localhost:3000/site/processing-invitations?isAccept=true&siteId=${siteId}`;
//     const declineUrl = `http://localhost:3000/site/processing-invitations?isAccept=false&siteId=${siteId}`;

//      const emailBody = `
//                     <h2>You have been invited to site ${siteName} by ${sender}</h2>
//                     <p>Click the button below to be a site member:</p>
//                     <a href=${acceptUrl}
//                        style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
//                         Accept invitation
//                     </a>
//                     <p>Or click the button below to decline the invitation:</p>
//                     <a href=${declineUrl}
//                        style="padding: 10px 20px; background:rgb(255, 24, 24); color: #fff; text-decoration: none; border-radius: 5px;">
//                         Decline invitation
//                     </a>
//                 `;

//     // Cấu hình SMTP
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     // Gửi đến tất cả người nhận cùng lúc
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: receivers.join(","), // Chuyển mảng email thành chuỗi
//         subject: `You have been invited to site ${siteName}`,
//         html: emailBody,
//     };

//     await transporter.sendMail(mailOptions);

//     return "Invitation emails send successfully!"
// }

const siteService = {
    getSiteById,
    createSite,
    getSiteByUserId,
    // inviteMembersByEmail,
    getAllSites,
    getSiteMembersById,
}

module.exports = siteService;
