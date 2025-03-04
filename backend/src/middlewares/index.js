const activityMiddleware = require("./activity.middleware");
const auth = require("./auth.middleware");
const projectMiddleware = require("./project.middleware");
const siteMiddleware = require("./site.middleware");

module.exports = {
    auth,
    activityMiddleware,
    projectMiddleware,
    siteMiddleware
};
