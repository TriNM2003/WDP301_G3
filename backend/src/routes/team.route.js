const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");


const teamRouter = express.Router();


teamRouter.use(bodyParser.json());


module.exports = teamRouter;