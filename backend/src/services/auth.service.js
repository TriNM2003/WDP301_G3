const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const createHttpErrors = require("http-errors");


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

    return {
        status: 200,
        message: "Register successfully, please active your account!",
        account: {
            username,
            email,
            password,
            fullName: '',
            phoneNumber: null,
            dob: null,
            address: '',
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

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1d", 
    });

    return {
        status: 200,
        message: "Login successfully!",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            status: user.status,
        },
    };
};

const authService = {
    login,
    register
}

module.exports = authService;
