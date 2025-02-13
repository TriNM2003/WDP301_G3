const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const passport = require("passport");
const loginByGoogleRequest = passport.authenticate('google', {scope: ['email', 'profile']});

// Endpoint đăng ký
authRouter.post("/register", authController.register);
// Endpoint đăng nhập
authRouter.post("/login", authController.login);
// scope
authRouter.get("/loginByGoogle", loginByGoogleRequest);
// thong tin tra ve
authRouter.get("/loginByGoogle/callback", authController.loginByGoogleCallback);

module.exports = authRouter;
