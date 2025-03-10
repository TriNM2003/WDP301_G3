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
const {slugify} = require("../utils/slugify.util");
const { mailer } = require("../configs");
const { default: mongoose } = require("mongoose");


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

const createSite = async (siteName, siteOwner) => {
    const siteOwnerData = await User.findOne({email: siteOwner});
    //check user co site chua
    const siteCheck2 = await Site.findOne({siteMember: {$elemMatch: {_id: siteOwnerData._id}}});
    if(siteCheck2){
        throw new Error("Each user can only have 1 site");
    }

    //check site name
    const siteCheck1 = await Site.findOne({siteName: siteName});
    if(siteCheck1){
        throw new Error("Site name already taken, please choose another name");
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

    const updateSiteMember = await Site.findOneAndUpdate(
        { "siteMember._id": siteMemberId },
        { $pull: { siteMember: { _id: siteMemberId } } }, // Xóa member khỏi danh sách
        { new: true } // Trả về tài liệu sau khi cập nhật
      ).select("siteMember").populate("siteMember._id");
      
    await User.findOneAndUpdate(
        { _id: siteMemberId }, // Tìm user theo _id
        { $unset: { site: "" } } // Xóa trường site
      );
      

    return {
        message:`Revoke site memeber ${siteMemberId} from site ${siteId} successfully!`,
        siteMember: updateSiteMember
    };
}

const getInvitaionsBySiteId = async (siteId) => {
    const allInvitations = await Site.findOne(
        {_id: siteId},
        {invitations: 1, _id: 0}
    ).populate("invitations.receiver");
    if(allInvitations === null){
        throw new Error("Site not found!")
    } 
    return allInvitations || [];
}


const cancelInvitationById = async (siteId, invitationId) => {
    // Tìm site trước để kiểm tra invitation
    const site = await Site.findOne(
        { _id: siteId, "invitations._id": invitationId },
        { "invitations.$": 1 } // Chỉ lấy invitation có _id tương ứng
    ).lean();

    // Kiểm tra nếu không tìm thấy invitation
    if (!site || !site.invitations || site.invitations.length === 0) {
        throw new Error(`Invitation with ID ${invitationId} not found in site ${siteId}`);
    }

    // Kiểm tra nếu invitation không ở trạng thái "pending"
    if (site.invitations.find(item => item._id.toString() === invitationId).status !== "pending") {
        throw new Error(`Only invitation with status 'pending' can be canceled.`);
    }

    // Nếu kiểm tra xong, tiến hành xóa invitation
    const updateInvitations = await Site.findOneAndUpdate(
        { _id: siteId },
        { $pull: { invitations: { _id: invitationId, status: "pending" } } },
        { new: true }
    ).select("invitations");

    return updateInvitations;
};



const siteService = {
    getSiteById,
    createSite,
    getSiteByUserId,
    inviteMemberByEmail, processingInvitation, 
    getAllSites,
    revokeSiteMemberAccess,
    getSiteMembersById,
    getAllUsersInSite,
    getInvitaionsBySiteId,
    cancelInvitationById,
}

module.exports = siteService;
