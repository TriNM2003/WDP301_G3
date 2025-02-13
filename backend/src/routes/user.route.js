const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");

const { UserController } = require("../controllers");

userRouter.use(bodyParser.json());
userRouter.put("/change-password",
    authMiddleware.verifyAccessToken,
    UserController.changePassword
)

module.exports = userRouter