const jwt = require("jsonwebtoken");

// het han trong 1h
const accessTokenExp = 60 * 60;
//het han trong 7 ngay
const refreshTokenExp = 60 * 60 * 24 * 7;
// tao access token voi user
const generateAccessToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: accessTokenExp, 
    });
}
// tao refresh token voi user
const generateRefreshToken = (user) => {
    return jwt.sign({id: user._id}, process.env.REFRESH_JWT_SECRET, {
        expiresIn: refreshTokenExp, 
    });
}

const jwtUtils = {
    accessTokenExp, refreshTokenExp,
    generateAccessToken,
    generateRefreshToken
}

module.exports = jwtUtils;