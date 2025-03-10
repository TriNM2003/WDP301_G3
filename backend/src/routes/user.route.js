const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const { UserController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");


userRouter.use(bodyParser.json());

userRouter.get("/user-profile", 
    authMiddleware.verifyAccessToken, 
    UserController.getUserById,
);

userRouter.put("/edit-profile", 
    authMiddleware.verifyAccessToken,
    cloudinary.upload.single("userAvatar"),  // Middleware upload file
    UserController.editProfile
);


userRouter.post("/send-delete-email", 
    authMiddleware.verifyAccessToken, 
    UserController.sendDeleteAccountEmail
);


userRouter.delete("/confirm-delete", 
    authMiddleware.verifyAccessToken, 
    UserController.confirmDeleteAccount
);

module.exports = userRouter