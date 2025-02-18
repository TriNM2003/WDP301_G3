const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../models/index");
const authService = require("../services/auth.service");
const passport = require("passport");

async function sendEmail(type, email, link) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let subject;
    let text;

    if (type == "verify") {
        subject = "Verify your account";
        text = `Click this link to verify your account: ${link}`;
    } else if (type == "reset") {
        subject = "Change your password";
        emailBody = `
            <h2>Change Your Password</h2>
            <p>Click the button below to change your password:</p>
            <a href="${link}" 
               style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                Change password
            </a>
            <p>If you didn't request this, please ignore this email.</p>
        `;
    } else {
        throw new Error("Invalid email type");
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: emailBody,
    };

    return transporter.sendMail(mailOptions);
}

async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await db.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "User or Email not found!" });
        }

        // Tạo JWT token có thời hạn 10 phút
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );

        // Gửi email mà không hiển thị token trong URL
        const link = `http://localhost:3000/reset-password`;


        await sendEmail("reset", email, link);

        res.json({ status: "Email sent, check your inbox!", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Something went wrong!" });
    }
}



// Hàm đặt lại mật khẩu
async function resetPassword(req, res) {
    const { password, confirmPassword, token } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ status: "Missing token!" });
        }

        // Giải mã token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra mật khẩu nhập lại
        if (password !== confirmPassword) {
            return res.status(400).json({ status: "Passwords do not match!" });
        }

        // Tìm user theo ID từ token
        const user = await db.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ status: "User Not Exists!" });
        }

        // Hash mật khẩu mới
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Cập nhật mật khẩu mới vào database
        await db.User.updateOne(
            { _id: decoded.id },
            { $set: { password: encryptedPassword } }
        );

        res.json({ status: "Password changed successfully!" });
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ status: "Reset link expired!" });
        }
        res.status(500).json({ status: "Something went wrong!" });
    }
}


const sendActivationEmail = async (req, res) => {
    const { token } = req.body;

    try {
        if (!token) {
            return res.status(400).json({ message: "Missing activation token!" });
        }

        // Giải mã token để lấy email
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.status === "active") {
            return res.status(400).json({ message: "Account is already activated!" });
        }

        // Tạo link kích hoạt
        const activationLink = `http://localhost:3000/active-account?token=${token}`;

        const emailBody = `
                <h2>Confirm Your Account Activation</h2>
                <p>Click the button below to activate your account:</p>
                <a href="${activationLink}"
                   style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                    Confirm Activation
                </a>
            `;

        // Gửi email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = { from: process.env.EMAIL_USER, to: user.email, subject: "Activate Your Account", html: emailBody };
        await transporter.sendMail(mailOptions);

        res.json({ message: "Activation email sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
};

const verifyAccount = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({ message: "Missing token!" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        if (user.status === "active") {
            return res.status(200).json({ message: "Account already activated!", alreadyActivated: true });
        }
        await db.User.updateOne({ _id: decoded.id }, { $set: { status: "active" } });
        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({
            message: "Account activated successfully!",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                status: "active",
            }
        });

    } catch (error) {
        console.error(error);

        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Activation link expired!" });
        }
        res.status(500).json({ message: "Something went wrong!" });
    }
};



const register = async (req, res) => {
    try {
        const accountInfo = await authService.register(req);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const accountInfo = await authService.login(username, password, res);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const loginByGoogle = passport.authenticate('google', { scope: ['email', 'profile'] });

const loginByGoogleCallback = (req, res, next) => {
    if (!req.user) {
        console.error("No user found after authentication.");
        return res.redirect("http://localhost:3000/error");
    }

    req.logIn(req.user, (loginErr) => {
        if (loginErr) {
            console.error("Login error:", loginErr);
            return res.redirect("http://localhost:3000/error");
        }

        res.cookie("user", JSON.stringify(req.user), { httpOnly: true });
        res.redirect("http://localhost:3000/home");
    });
};

const getRefreshToken = async (req, res) => {
    try {
        // lay refresh token theo user id
        const refreshToken = await authService.getRefreshToken(req.body.id);
        res.status(200).json(refreshToken);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        // lay access token moi dua tren refresh token va user id
        const result = await authService.refreshAccessToken(req, res);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
}

const AuthController = {
    sendEmail,
    forgotPassword,
    resetPassword,
    sendActivationEmail,
    verifyAccount,
    login,
    register,
    loginByGoogleCallback,
    loginByGoogle,
    getRefreshToken,
    refreshAccessToken,
}

module.exports = AuthController
