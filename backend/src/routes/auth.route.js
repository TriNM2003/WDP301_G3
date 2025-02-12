const express = require("express");
const authRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const { AuthController } = require("../controllers");


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

module.exports = authRouter