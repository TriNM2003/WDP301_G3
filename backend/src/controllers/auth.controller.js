const authService = require("../services/auth.service");

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
        const accountInfo = await authService.login(username, password);
        res.status(accountInfo.status).json(accountInfo);
    } catch (error) {
        res.status(400).json({ 
            message: error.message 
        });
    }
};

const authController = {
    register,
    login,
}

module.exports = authController;
