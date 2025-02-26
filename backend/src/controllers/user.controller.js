const db = require('../models');
const morgan = require("morgan")
const mongoose = require("mongoose");
const createHttpErrors = require("http-errors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const {cloudinary} = require('../configs/cloudinary');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');




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

const sendDeleteAccountEmail = async (req, res) => {
    try {
        const userId = req.payload.id; // Lấy ID từ accessToken
        const { password } = req.body;

        // Tìm user trong database
        const user = await db.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Xác thực mật khẩu nhập vào
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        // Tạo link xác nhận xóa tài khoản (dùng accessToken thay vì tạo mới)
        const deleteLink = `http://localhost:3000/confirm-delete`;

        // Cấu hình email gửi xác nhận
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Confirm Account Deletion",
            html: `
                <h2>Confirm Account Deletion</h2>
                <p>Click the button below to permanently delete your account:</p>
                <a href="${deleteLink}"
                   style="padding: 10px 20px; background: red; color: #fff; text-decoration: none; border-radius: 5px;">
                    Confirm Delete
                </a>
                <p>This link is valid for 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "A confirmation email has been sent. Please check your inbox." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

// API xử lý khi người dùng nhấn vào link xóa tài khoản trong email
const confirmDeleteAccount = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Missing authorization token!" });
        }

        const token = authHeader.split(" ")[1]; // Lấy AccessToken từ header
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra user có tồn tại không
        const user = await db.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Xóa tài khoản
        await db.User.findByIdAndDelete(decoded.id);
        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.log("Error deleting account:", error);
        return res.status(500).json({ message: "Invalid or expired token!" });
    }
};

const UserControllers = {
    deleteUser,
    editProfile,
    getUserById,
  changePassword,
  sendDeleteAccountEmail,
  confirmDeleteAccount,
};

module.exports = UserControllers;