const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Đăng ký người dùng
const registerUser = async (userData) => {
    const { username, email, password, fullName, phoneNumber, dob, address } = userData;

    // Kiểm tra username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        throw new Error("Username or Email already exists");
    }

    // Hash mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        fullName,
        phoneNumber,
        dob,
        address,
        status: "inactive", // Mặc định inactive, cần admin kích hoạt
    });

    // Lưu user vào database
    await newUser.save();

    return { message: "Register successfully, please active your account!" };
};

// Đăng nhập người dùng
const loginUser = async (usernameOrEmail, password) => {
    // Kiểm tra user có tồn tại không
    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
        throw new Error("Account does not exists");
    }


    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Wrong password");
    }

    // Tạo JWT Token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1d", // Token hết hạn sau 1 ngày
    });

    return {
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

module.exports = { registerUser, loginUser };
