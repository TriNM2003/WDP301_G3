const activityService = require("./activity.service");
const activityTypeService = require("./activityType.service");
const notificationService = require("./notification.service");
const projectService = require("./project.service");
const siteService = require("./site.service");
const sprintService = require("./sprint.service");
const stageService = require("./stage.service");
const systemRoleService = require("./systemRole.service");
const teamService = require("./team.service");
const userService = require("./user.service");


module.exports = {
    
    projectService,
    activityService,
    siteService,
    activityTypeService,
    notificationService,
    sprintService,
    stageService,
    systemRoleService,
    teamService,
    userService
}