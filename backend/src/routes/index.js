const systemRoleRouter = require("./systemRole.route");
const authRouter= require("./auth.route");
const userRouter = require("./user.route");
const projectRouter = require("./project.route");
const activityRouter = require("./activity.route");
const siteRouter = require("./site.route");

module.exports = {
    systemRoleRouter,
    authRouter,
    userRouter,
    projectRouter,
    activityRouter,
    siteRouter
};
