const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const passport = require("../configs/passport.config");
const { stringify } = require("qs");
const redisClient = require("../configs/redisClient");
const {bcryptUtils, jwtUtils, redisUtils} = require("../utils")
require("../middlewares/auth.middleware");


const register = async (req) => {
    const { username, email, password} = req.body;
    const isUsernameExisted = await User.findOne({username: username});
    if (isUsernameExisted) {
        return {
            status: 400,
            message: "Username already exists"
        };
    }
    const isEmailExisted = await User.findOne({email: email});
    if (isEmailExisted) {
        return {
            status: 400,
            message: "Email already exists"
        };
    }
    const hashedPassword = await bcryptUtils.encryptPassword(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        fullName: null,
        phoneNumber: null,
        dob: null,
        address: null,

        roles: [],
        userAvatar: "https://i.pinimg.com/736x/2e/9b/34/2e9b3443e8afa8d383c132c7b3745d47.jpg",
        notifications: [],
        activities: [],
        projects: [],
        teams: [],
        googleId: null,

        status: "inactive",
    });
    await newUser.save();
    return {
        status: 200,
        message: "Register successfully, please active your account!",
        account: newUser
     };
};


const login = async (username, password, res) => {
    const user = await User.findOne({username: username});
    if (!user) {
        return {
            status: 404,
            message: "Username not found!"
        };
    }

    // check co phai account dk bang google
    if (user.googleId !== null) {
        return {
            status: 400,
            message: "Please login by Google!"
        };
    }


    const isMatch = await bcryptUtils.comparePassword(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
        return {
            status: 400,
            message: "Wrong password!"
        };
    }
  // Nếu tài khoản chưa kích hoạt, gửi token về FE để kích hoạt
  if (user.status === "inactive") {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
    return {  
        status: 403,
        message: "Account not activated! Redirecting to activation page...",
        token
    };
} 
    // accessToken
    const accessToken = jwtUtils.generateAccessToken(user);
    // refresh token
    const refreshToken = jwtUtils.generateRefreshToken(user);
    // luu vao trong redis
    await redisUtils.setRefreshToken(user._id, refreshToken, jwtUtils.refreshTokenExp);
    return {
        status: 200,
        message: "Login successfully!",
        accessToken: accessToken,
        accessTokenExp: jwtUtils.accessTokenExp,
        user: user,
    };
};


const logout = async (userId) => {
    await redisUtils.deleteRefreshToken(userId);
    return {
        status: 200,
        message: "Logout successfully!"
    };
}


const getRefreshToken = async (userId) => {
    const refreshToken = await redisUtils.getRefreshToken(userId);
    if (!refreshToken) {
        throw new Error("Refresh token not found!");
    }
    return refreshToken;
}

const getUserByAccessToken = async (accessToken) => {
    //decode access Token
    const decodedAccessToken = jwtUtils.decode(accessToken);

    // get user
    const user = await User.findById(decodedAccessToken.id);

    // Nếu tài khoản chưa kích hoạt, gửi token về FE để kích hoạt
  if (user.status === "inactive") {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
    const error = new Error("Account not activated! Redirecting to activation page...");
    error.status = 403; 
    error.token = token;
    throw error;

    }
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        address: user.address,
        roles: user.roles,
        userAvatar: user.userAvatar,
        status: user.status,
        notifications: user.notifications,
        activities: user.activities,
        projects: user.projects,
        teams: user.teams,
        googleId: user.googleId
    };
}

const refreshAccessToken = async (req, res) => {
    // lay refresh token va user id
    const { refreshToken, id} = req.body;
    const user = await User.findById(id);

    // Xác thực refreshToken
    // console.log(refreshToken);
    const isValid = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    if (!isValid) {
        throw new Error("Refresh token is invalid!");
    }

    // Tạo accessToken mới
    const accessToken = jwtUtils.generateAccessToken(user);

    return {
        message: "Refresh access token successfully!",
        accessToken: accessToken,
        accessTokenExp: jwtUtils.accessTokenExp,
    };
};



const authService = {
    login,
    register,
    getUserByAccessToken,
    getRefreshToken,
    refreshAccessToken,logout,
}

module.exports = authService;
