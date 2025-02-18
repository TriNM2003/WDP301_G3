const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const passport = require("../configs/passport.config");
const { stringify } = require("qs");
const redisClient = require("../utils/redisClient");
require("../middlewares/auth.middleware");

// het han trong 1h
const accessTokenExp = 60 * 60;

const register = async (req) => {
    const { username, email, password} = req.body;

    const isUsernameExisted = await User.findOne({username: username});
    if (isUsernameExisted) {
        // return next(createHttpErrors(400, "Username already exists"));
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        fullName: null,
        phoneNumber: null,
        dob: null,
        address: null,
        status: "inactive",
    });

    await newUser.save();

    // send email here
    
    return {
        status: 200,
        message: "Register successfully, please active your account!",
        account: {
            username,
            email,
            password,
            fullName: null,
            phoneNumber: null,
            dob: null,
            address: null,
            status: "inactive",
        }
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

    const isMatch = await bcrypt.compare(password, user.password);
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
    const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: accessTokenExp, 
    });
    // refresh token
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d", 
    });

    // luu vao trong cookie
    // res.cookie("accessToken", accessToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     maxAge: 60 * 60 * 1000
    // });
    // luu vao trong redis
    await redisClient.set(`refreshToken:${user._id}`, refreshToken, "EX",  7 * 24 * 60 * 60 * 1000).then(() => console.log("Create user refresh token successfully!"));

    return {
        status: 200,
        message: "Login successfully!",
        accessToken: accessToken,
        accessTokenExp: accessTokenExp,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            dob: user.dob,
            address: user.address,
            roles: user.roles,
            activities: user.activities,
            teams: user.teams,
            notifications: user.notifications,
            status: user.status
        },
    };
};


// const loginByGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

const loginByGoogleCallback = () => {
    return passport.authenticate('google',{failureRedirect: "/auth/login"},(req, res) => {
        // tao cookie lu giu thong tin user
        res.cookie("user", JSON.stringify(req.user), {httpOnly: true, secure: true, sameSite: "none", maxAge: 60 * 60 * 1000});
        res.redirect(`http://localhost:3000/home123`);
    });
}

const getRefreshToken = async (userId) => {
    const refreshToken = await redisClient.get(`refreshToken:${userId}`);
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
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: accessTokenExp,
    });

    return {
        message: "Refresh access token successfully!",
        accessToken: accessToken,
        accessTokenExp: accessTokenExp,
    };
};



const authService = {
    login,
    loginByGoogleCallback,
    register,
    getRefreshToken,
    refreshAccessToken,
}

module.exports = authService;
