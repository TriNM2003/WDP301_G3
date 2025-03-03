const Site = require("../models/site.model");
const fs = require("fs")
const {cloudinary} = require('../configs/cloudinary');
const path = require('path');
const { User } = require("../models");

const getSiteById = async (id) => {
    const site = await Site.findById(id);
    return site;
}

const createSite = async (requestData, imageFile, userId) => {

    
    //check user co site chua
    const siteCheck2 = await Site.findOne({siteMember: {$elemMatch: {_id: userId}}});
    if(siteCheck2){
        throw new Error("Each user can only create 1 site");
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
            _id: userId,
            roles: ["siteOwner"]
        }],
        siteAvatar: siteAvatar,
        siteDescription: requestData.siteDescription
    });

    // cap nhap site cua user
    const user = await User.findById(userId);
    user.site = newSite._id;
    await user.save()

    return newSite;
}

const SiteService = {
    getSiteById,
    createSite,
}

module.exports = SiteService;