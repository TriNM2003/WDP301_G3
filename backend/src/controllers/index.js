const SystemRoleController = require("./systemRole.controller");
const AuthController = require("./auth.controller");
const UserController = require("./user.controller");
const projectController = require("./project.controller");
const activityController = require("./activity.controller");
const siteController = require("./site.controller");
const activityTypeController = require("./activityType.controller");
const notificationController = require("./notification.controller");
const sprintController = require("./sprint.controller");
const stageController = require("./stage.controller");
const teamController = require("./team.controller");

module.exports = {
    SystemRoleController,
    AuthController,
    UserController,
    projectController,
    activityController,
    siteController,
    activityTypeController,
    notificationController,
    sprintController,
    stageController,
    teamController
};
