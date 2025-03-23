const express = require("express");
const userRouter = express.Router();
const bodyParser = require("body-parser");
const db = require("../models/index");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");
const { UserController } = require("../controllers");
const cloudinary = require("../configs/cloudinary");
const { isActive } = require("../middlewares/account.middleware");


userRouter.use(bodyParser.json());
userRouter.use([isActive,authMiddleware.verifyAccessToken ]);

userRouter.get("/all",
    UserController.getAllUsers
)

userRouter.get("/user-profile", 
    UserController.getUserById,
);

userRouter.put("/edit-profile", 
    cloudinary.upload.single("userAvatar"),  // Middleware upload file
    UserController.editProfile
);


userRouter.post("/send-delete-email", 
    UserController.sendDeleteAccountEmail
);


userRouter.delete("/confirm-delete", 
    UserController.confirmDeleteAccount
);


userRouter.put("/change-password",
    UserController.changePassword
);

// get activity by userId
userRouter.get("/user-activities", 
    UserController.getUserActivities

);

// getUserInfoByUserIdFromParams
userRouter.get("/user/:userId",
    UserController.getUserInfoByUserIdFromParams
);
userRouter.get("/:userId/get-user-by-id",
    UserController.getOtherUserById
)

module.exports = userRouter