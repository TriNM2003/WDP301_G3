const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      validate: {
        validator: function (value) {
          return !/\s/.test(value); // Không cho phép khoảng trắng trong password
        },
        message: "Password không được chứa khoảng trắng!",
      },
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      match: /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, // Chỉ cho phép chữ cái và dấu cách
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^(0[3|5|7|8|9])+([0-9]{8})$/, // Format số điện thoại Việt Nam
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value < new Date(); // Ngày sinh không được là tương lai
        },
        message: "Ngày sinh không thể nằm trong tương lai!",
      },
    },
    address: {
      type: String,
      trim: true,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "systemRole",
      },
    ],
    userAvatar: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deactived", "banned"],
      default: "active",
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "site",
    },
    notifications: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "notification",
        },
        isSeen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "activity",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
    ],
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team",
      },
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
