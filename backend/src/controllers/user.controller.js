const db = require('../models');
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");
const bcrypt = require("bcrypt");
const {cloudinary} = require('../configs/cloudinary');
const path = require('path');
const fs = require('fs');




const changePassword = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const { oldPassword, newPassword, confirmPassword} = req.body;
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirmation do not match" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.User.findByIdAndUpdate(userId, { password: hashedPassword });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//get user by Id

const getUserById = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const editProfile = async (req, res) => {
    try {
        console.log("Req file:", req.file);
        const { fullName, address, dob, phoneNumber } = req.body;
        const userId = req.payload.id;
        const user = await db.User.findById(userId);
        
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        let newAvatarUrl = user.userAvatar; // Giữ nguyên ảnh cũ nếu không upload ảnh mới

        // Kiểm tra nếu có ảnh được tải lên
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                if (result && result.secure_url) {
                    newAvatarUrl = result.secure_url;
                    // Xóa ảnh cục bộ sau khi upload thành công
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error("Error deleting local file:", err);
                    });
                } else {
                    return res.status(500).json({ message: "Failed to upload image" });
                }
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                fs.unlink(req.file.path, () => {});
                return res.status(500).json({ message: "Image capacity is too large!" });
            }
        }

        // Cập nhật thông tin user
        user.fullName = fullName;
        user.phoneNumber = phoneNumber;
        user.dob = dob;
        user.address = address;
        user.userAvatar = newAvatarUrl;

        // Lưu user vào database
        await user.save();

        res.status(200).json({ 
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            dob: user.dob,
            address: user.address,
            userAvatar: user.userAvatar
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.payload.id;
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        await db.User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const UserControllers = {
    deleteUser,
    editProfile,
    getUserById,
  changePassword

};

module.exports = UserControllers;