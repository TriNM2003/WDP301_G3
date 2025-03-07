const userService = require("../services/user.service");
const fs = require('fs');
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.payload.id);
        if (!user) return res.status(400).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const response = await userService.changePassword(req.payload.id, oldPassword, newPassword, confirmPassword);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        console.log("Req file:", req.file);
        const { fullName, address, dob, phoneNumber } = req.body;
        const response = await userService.editProfile(req.payload.id, fullName, address, dob, phoneNumber, req.file);
        res.status(200).json(response);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.unlink(req.file.path, () => { });
        return res.status(500).json({ message: "Cant't update profile! Try again." });

    }
};

const sendDeleteAccountEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userService.sendDeleteAccountEmail(req.payload.id, email);
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmDeleteAccount = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Missing authorization token!" });

        const response = await userService.confirmDeleteAccount(token);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const UserControllers = {
    getAllUsers,
    getUserById,
    changePassword,
    editProfile,
    sendDeleteAccountEmail,
    confirmDeleteAccount
};

module.exports = UserControllers;
