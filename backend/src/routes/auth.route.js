const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyAccessToken, verifyGoogleCallback } = require("../middlewares/auth.middleware");

// Endpoint đăng ký
authRouter.post("/register", authController.register);
// Endpoint đăng nhập
authRouter.post("/login", authController.login);
// scope
authRouter.get("/loginByGoogle", authController.loginByGoogle);
// thong tin tra ve
authRouter.get("/loginByGoogle/callback", verifyGoogleCallback, authController.loginByGoogleCallback);

authRouter.post("/refresh", authController.refreshAccessToken);
authRouter.post("/getRefreshToken", authController.getRefreshToken);

module.exports = authRouter;
