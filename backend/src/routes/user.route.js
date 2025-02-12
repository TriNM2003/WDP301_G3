const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");

const { UserController } = require("../controllers");

userRouter.use(bodyParser.json());

userRouter.get("/:userId", UserController.getUserById);
userRouter.put("/edit-profile", UserController.editProfile);

module.exports = userRouter