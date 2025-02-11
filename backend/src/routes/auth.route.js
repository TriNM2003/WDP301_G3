const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth.controller");

// Endpoint đăng ký
authRouter.post("/register", authController.register);

// Endpoint đăng nhập
authRouter.post("/login", authController.login);

module.exports = authRouter;
