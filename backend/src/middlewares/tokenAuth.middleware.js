const jwt = require("jsonwebtoken");;

const tokenAuth = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Token not found, Access Denied!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Gán thông tin user từ token vào request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token, Access Denied!"});
    }
};

module.exports = tokenAuth;
