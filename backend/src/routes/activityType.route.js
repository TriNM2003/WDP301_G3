const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");


const activityTypeRouter = express.Router();


activityTypeRouter.use(bodyParser.json());


module.exports = activityTypeRouter;