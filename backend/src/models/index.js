const mongoose = require("mongoose");
const User = require("./user.model");
const SystemRole = require("./systemRole.model");
const Site = require("./site.model");
const Notification = require("./notification.model");
const Project = require("./project.model");
const Team = require("./team.model");
const Activity = require("./activity.model");
const Sprint = require("./sprint.model");
const Stage = require("./stage.model");
const ActivityType = require("./activityType.model");
const db = {};


db.User = User;
db.SystemRole = SystemRole;
db.Site = Site;
db.Notification = Notification;
db.Project = Project;
db.Team = Team;
db.Activity = Activity;
db.Sprint = Sprint;
db.Stage = Stage;
db.ActivityType = ActivityType;

db.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Kết thúc quá trình nếu có lỗi
  }
};
// hao
module.exports = db;
