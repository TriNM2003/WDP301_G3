const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const passport = require("passport");
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


const login = async (username, password) => {
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

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d", 
    });

    return {
        status: 200,
        message: "Login successfully!",
        token: token,
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

//unfinished
const loginByGoogleCallback = () => {
    passport.authenticate('google'),{failureRedirect: "/auth/login"},(req, res) => {
        res.redirect(`http://localhost:3000/auth/login`);
    }
}


const authService = {
    login,
    loginByGoogleCallback,
    register,
}

module.exports = authService;
