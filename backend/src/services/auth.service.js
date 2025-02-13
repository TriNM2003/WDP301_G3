const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const passport = require("../configs/passport.config");
const { stringify } = require("qs");
require("../middlewares/auth.middleware");

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

    // accessToken
    const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1h", 
    });
    // refresh token
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "7d", 
    });

    // luu vao trong cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 *1000
    });

    return {
        status: 200,
        message: "Login successfully!",
        accessToken: accessToken,
        refreshToken: refreshToken,
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

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token not found!" });
        }

        // Xác thực refreshToken
        const user = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        if (!user) {
            return res.status(403).json({ message: "Refresh token is invalid!" });
        }

        // Tạo accessToken mới
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Đặt accessToken vào cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Refresh token successfully!",
            accessToken: accessToken,
        });

    } catch (err) {
        console.error("Error refreshing token:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const authService = {
    login,
    loginByGoogleCallback,
    register,
    refreshAccessToken,
}

module.exports = authService;
