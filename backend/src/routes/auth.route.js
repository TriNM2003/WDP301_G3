const express = require("express");
const authRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthController } = require("../controllers");
const authController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const passport = require("passport");
const loginByGoogleRequest = passport.authenticate('google', {scope: ['email', 'profile']});

authRouter.use(bodyParser.json());
authRouter.post("/forgot-password",
    AuthController.forgotPassword
)
authRouter.post("/reset-password",
    AuthController.resetPassword
)
authRouter.post("/send-activation-email",
    AuthController.sendActivationEmail
)
authRouter.post("/verify-account", 
    AuthController.verifyAccount
)


// Endpoint đăng ký
authRouter.post("/register", authController.register);
// Endpoint đăng nhập
authRouter.post("/login", authController.login);
// scope
authRouter.get("/loginByGoogle", loginByGoogleRequest);
// thong tin tra ve
authRouter.get("/loginByGoogle/callback", authController.loginByGoogleCallback);

module.exports = authRouter;
