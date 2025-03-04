const systemRoleRouter = require("./systemRole.route");
const authRouter= require("./auth.route");
const userRouter = require("./user.route");
const projectRouter = require("./project.route");
const activityRouter = require("./activity.route");
const siteRouter = require("./site.route");
const activityTypeRouter = require("./activityType.route");
const notificationRouter = require("./notification.route");
const sprintRouter = require("./sprint.route");
const stageRouter = require("./stage.route");
const teamRouter = require("./team.route");

module.exports = {
    systemRoleRouter,
    authRouter,
    userRouter,
    projectRouter,
    activityRouter,
    siteRouter,
    activityTypeRouter,
    notificationRouter,
    sprintRouter,
    stageRouter,
    teamRouter
};
