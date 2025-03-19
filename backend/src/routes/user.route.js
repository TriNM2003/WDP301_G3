const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const accountMiddleware = require("../middlewares/account.middleware");
const multer = require("multer");
const path = require("path");
const { UserController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");


userRouter.use(bodyParser.json());

userRouter.get("/all",
    authMiddleware.verifyAccessToken,
    accountMiddleware.isActive,
    UserController.getAllUsers
)

userRouter.get("/user-profile", 
    authMiddleware.verifyAccessToken, 
    accountMiddleware.isActive,
    UserController.getUserById,
);

userRouter.get("/user-information",
    authMiddleware.verifyAccessToken,
    accountMiddleware.isActive,
    UserController.getUserByIdInfomation
);

userRouter.put("/edit-profile", 
    authMiddleware.verifyAccessToken,
    accountMiddleware.isActive,
    cloudinary.upload.single("userAvatar"),
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


userRouter.put("/change-password",
    authMiddleware.verifyAccessToken,
    UserController.changePassword
);

// get activity by userId
userRouter.get("/user-activities", 
    authMiddleware.verifyAccessToken, 
    UserController.getUserActivities

);

// getUserInfoByUserIdFromParams
userRouter.get("/user/:userId",
    authMiddleware.verifyAccessToken,
    UserController.getUserInfoByUserIdFromParams
);
userRouter.get("/:userId/get-user-by-id",
    authMiddleware.verifyAccessToken,
    UserController.getOtherUserById
)

module.exports = userRouter