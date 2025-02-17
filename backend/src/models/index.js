const mongoose = require("mongoose");
const User = require("./user.model");
const SystemRole = require("./systemRole.model");

const db = {};


db.Users = User;
db.SystemRole = SystemRole;

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
