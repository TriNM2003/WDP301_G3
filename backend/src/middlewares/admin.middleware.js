const db = require("../models");

const isAdmin = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const user = await db.User.findOne({ _id: id}).populate("roles");
        if(!user.roles.some(role => role.roleName === "Admin")) {
            return res.status(400).json({ error: { status: 400, message: "User is not admin!" }});
        }
        next();
    } catch (error) {
        next(error)
    }

}

const adminMiddleware = {
    isAdmin
}

module.exports = adminMiddleware;
