const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");

const { UserController } = require("../controllers");

userRouter.use(bodyParser.json());

userRouter.get("/user-profile", authMiddleware.verifyAccessToken, UserController.getUserById);
userRouter.put("/edit-profile", authMiddleware.verifyAccessToken, UserController.editProfile);

module.exports = userRouter