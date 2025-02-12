const authService = require("../services/auth.service");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const accountInfo = await authService.register(req);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
};
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const accountInfo = await authService.login(username, password);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
};


const loginByGoogleCallback = async (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/auth/login" }, (err, user) => {
        // if (err || !user) {
        //     return res.redirect("/auth/login?error=Authentication Failed");
        // }

        // // Kiểm tra trạng thái tài khoản
        // if (user.status !== "active") {
        //     return res.redirect("/auth/login?error=Please activate your account");
        // }

        // Tạo JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Chuyển hướng đến frontend với thông tin user
        res.redirect(`http://localhost:3000/auth/login?username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}&password=${encodeURIComponent(user.password)}&status=${encodeURIComponent(user.status)}&token=${token}`);
    })(req, res, next);
}

const authController = {
    register,
    login,
    loginByGoogleCallback,
}

module.exports = authController;
