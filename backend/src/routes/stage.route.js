const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");


const stageRouter = express.Router();


stageRouter.use(bodyParser.json());


module.exports = stageRouter;