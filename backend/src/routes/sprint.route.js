const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");


const sprintRouter = express.Router();


sprintRouter.use(bodyParser.json());


module.exports = sprintRouter;