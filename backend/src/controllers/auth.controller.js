const authService = require("../services/auth.service");
const passport = require("passport");
require("../configs/passport.config");

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
        const accountInfo = await authService.login(username, password, res);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
};


const loginByGoogle = passport.authenticate('google', { scope: ['email', 'profile'] });

const loginByGoogleCallback = (req, res, next) => {
    if (!req.user) {
        console.error("No user found after authentication.");
        return res.redirect("http://localhost:3000/error");
    }

    req.logIn(req.user, (loginErr) => {
        if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("http://localhost:3000/error");
        }

        res.cookie("user", JSON.stringify(req.user), { httpOnly: true });
        res.redirect("http://localhost:3000/home");
    });
};


const refreshAccessToken = async (req, res) => {
    try {
        await authService.refreshAccessToken(req, res);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const authController = {
    register,
    login,
    loginByGoogle, loginByGoogleCallback,
    refreshAccessToken,
}

module.exports = authController;
