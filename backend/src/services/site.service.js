const Site = require("../models/site.model");
const fs = require("fs")
const { cloudinary } = require('../configs/cloudinary');
const cloudinaryFile = require('../configs/cloudinary');
const path = require('path');
const { User } = require("../models");
const db = require('../models');
const JWT = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const morgan = require("morgan")
const createHttpErrors = require("http-errors");
const nodemailer = require("nodemailer")
const {slugify} = require("../utils/slugify.util");
const { mailer } = require("../configs");
const { default: mongoose } = require("mongoose");


const getAllSites = async () => {
    const sites = await Site.find({}).populate("siteMember._id");
    return sites;
}

const getSiteById = async (id) => {
    const site = await Site.findById(id).populate("siteMember._id");
    if (!site) {
        throw new Error("No site found");
    }
    return site;
}

const getSiteMembersById = async (id) => {
    const site = await Site.findById(id).populate("siteMember._id");
    if (!site) {
        throw new Error("No site found");
    }
    return site.siteMember;
}

const createSite = async (requestData, imageFile) => {
    const siteOwner = await User.findOne({ email: requestData.siteOwner });
    //check user co site chua
    const siteCheck2 = await Site.findOne({ siteMember: { $elemMatch: { _id: siteOwner._id } } });
    if (siteCheck2) {
        throw new Error("Each user can only have 1 site");
    }

    //check site name
    const siteCheck1 = await Site.findOne({ siteName: requestData.siteName });
    if (siteCheck1) {
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
        siteName: siteName,
        siteRoles: ["siteOwner", "siteMember"],
        siteMember: [{
            _id: siteOwnerData._id,
            roles: ["siteOwner"]
        }],
        siteSlug: slugify(siteName)
    });

    // cap nhap site cua user
    siteOwnerData.site = newSite._id;
    await siteOwnerData.save()

    return newSite;
}

const editSite = async (siteId, updateData, imageFile) => {
    try {
        const site = await Site.findById(siteId);
        if (!site) throw new Error("Site not found");

        let newAvatarUrl = site.siteAvatar;

        // 🔹 Nếu có ảnh mới, upload lên Cloudinary và xóa ảnh cũ
        if (imageFile) {
            try {
                const result = await cloudinary.uploader.upload(imageFile.path);
                if (result && result.secure_url) {
                    newAvatarUrl = result.secure_url;
                    fs.unlink(imageFile.path, (err) => {
                        if (err) console.error("Error deleting local file:", err);
                    });
                } else {
                    throw new Error("Failed to upload image");
                }
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                fs.unlink(imageFile.path, () => { });
                throw new Error("Failed to edit site! Try again.");
            }
        }

        const newSite = {
            siteName: updateData.siteName || site.siteName,
            siteDescription: updateData.siteDescription || site.siteDescription,
            siteAvatar: newAvatarUrl,
            siteSlug: slugify(updateData.siteSlug || site.siteSlug),
        }

        await Site.findByIdAndUpdate(siteId, {
            $set: {
                siteName: newSite.siteName,
                siteDescription: newSite.siteDescription,
                siteAvatar: newSite.siteAvatar,
                siteSlug: newSite.siteSlug
            }
        }, { new: true });

        return site;
    } catch (error) {
        throw error;
    }
};


const deactivateSite = async (siteId) => {
    try {
        const site = await Site.findById(siteId);
        if (!site) throw new Error("Site not found");

        // 🔹 Chuyển trạng thái site thành "deactivated"
        await Site.findByIdAndUpdate(siteId, { $set: { siteStatus: "deactivated" } }, { new: true });

        return { message: "Site has been deactivated successfully", site };
    } catch (error) {
        throw error;
    }
};

const getSiteByUserId = async (userId) => {
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





const inviteMemberByEmail = async (senderId, receiverId, siteId) => {
    const sender = await User.findById(senderId);
    if(!sender){
         throw new Error("Sender does not exist!");
    }
   const receiver = await User.findById(receiverId);
   if(!receiver){
        throw new Error("Receiver does not exist!");
   }
   const site = await Site.findById(siteId);
   if(!site){
        throw new Error("Site does not exist!");
   }
   if(receiver.site === site._id){
        throw new Error("Receiver already site member!");
   }

   // tao invitation moi
   const invitationId = new mongoose.Types.ObjectId();
   site.invitations.push({
        _id: invitationId,
        sender: sender._id,
        receiver: receiver._id,
   })
   const updatedSite = await site.save();

   await mailer.sendInvitation(receiver.email, invitationId, site.siteName);

    return updatedSite.invitations;
}

const processingInvitation = async (invitationId, decision) => {
   const invitationSite = await Site.findOne({"invitations._id": invitationId});
   if(!invitationSite){
    throw new Error("Invitation does not exist!");
   }
   const invitation = invitationSite.invitations.find(item => item._id.toString() === invitationId);
//    if(invitation.receiver !== user._id){
//     throw new Error("User are not receiver!");
//    }
   //check status == pending
   if(invitation.status !== "pending"){
        throw new Error("Invitation has been processed or expired!");
   }

   // Kiểm tra nếu invitation đã hết hạn
   if (invitation.expireAt && invitation.expireAt < new Date()) {
    invitation.status = "expired",
    await invitationSite.save();
    throw new Error("Invitation has expired!");
    }

    // xu ly invitation
    if(decision === "accepted"){
        invitation.status = "accepted"
        const newMember = await User.findById(invitation.receiver);
        if (!newMember) {
            throw new Error("Receiver does not exist!");
        }
        if(newMember.status !== "active"){
            throw new Error("Receiver is not activated!");
        }
        invitationSite.siteMember.push({
            _id: newMember._id,
            roles: ["siteMember"]
        })
        newMember.site = invitationSite._id;
        await invitationSite.save();
        await newMember.save();
    }else if (decision === "declined"){
        invitation.status = "declined"
        await invitationSite.save();
    }else{
        throw new Error("No decision provided!");
    }

   return {
     decision: decision,
     invitation: invitation
   };
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
    editSite,
    getSiteByUserId,
    inviteMemberByEmail, processingInvitation,
    getAllSites,
    deactivateSite,    revokeSiteMemberAccess,
    getSiteMembersById,

    getAllUsersInSite

}

module.exports = siteService;
