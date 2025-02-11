const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");

const { UserController } = require("../controllers");

userRouter.use(bodyParser.json());
userRouter.put("/change-password",
    UserController.changePassword
)

module.exports = userRouter