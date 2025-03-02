const express = require("express");
const authRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthController } = require("../controllers");
const authController = require("../controllers/auth.controller");
const { verifyAccessToken, verifyGoogleCallback } = require("../middlewares/auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

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

// login, register bang google
authRouter.get("/loginByGoogle", authController.loginByGoogle);
authRouter.get("/loginByGoogle/callback", verifyGoogleCallback, authController.loginByGoogleCallback);
authRouter.get("/getUserByAccessToken", authController.getUserByAccessToken);  

// refresh access token
authRouter.post("/refresh", authController.refreshAccessToken);
authRouter.post("/getRefreshToken", authController.getRefreshToken);

authRouter.get("/checkLoginStatus", authController.checkLoginStatus);

authRouter.post("/logout", authController.logout);


// authRouter.get("/testToken", authMiddleware.verifyAccessToken, (req, res) => { res.status(200).json({ message: "Token is valid" }) });

module.exports = authRouter;
