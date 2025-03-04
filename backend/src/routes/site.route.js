const express = require("express");
const bodyParser = require("body-parser");
const db = require("../models/index");
const { siteController } = require("../controllers");

const siteRouter = express.Router();


siteRouter.use(bodyParser.json());
siteRouter.get("/get-by-user-id",
    siteController.getSiteByUserId
)

module.exports = siteRouter;