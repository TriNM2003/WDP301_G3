const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");


const notificationRouter = express.Router();


notificationRouter.use(bodyParser.json());


module.exports = notificationRouter;