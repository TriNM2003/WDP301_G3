const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const tokenAuth = require("../middlewares/tokenAuth.middleware");

// Endpoint đăng ký
router.post("/register", userController.register);

// Endpoint đăng nhập
router.post("/login", userController.login);

module.exports = router;
