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
        userAvatar: "https://static.thenounproject.com/png/5100711-200.png",
        notifications: [],
        activities: [],
        projects: [],
        teams: [],
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


// const loginByGoogleCallback = () => {
//     return passport.authenticate('google',{failureRedirect: "/auth/login"},(req, res) => {
//         // tao cookie lu giu thong tin user
//         res.cookie("user", JSON.stringify(req.user), {httpOnly: true, secure: true, sameSite: "none", maxAge: 60 * 60 * 1000});
//         res.redirect(`http://localhost:3000/home123`);
//     });
// }

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
    // loginByGoogleCallback,
    register,
    getRefreshToken,
    refreshAccessToken,logout,
}

module.exports = authService;
