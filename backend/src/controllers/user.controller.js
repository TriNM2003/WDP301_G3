const userService = require("../services/user.service");

// Controller Đăng ký
const register = async (req, res) => {
    try {
        const response = await userService.registerUser(req.body);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller Đăng nhập
const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        const response = await userService.loginUser(usernameOrEmail, password);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { register, login };
