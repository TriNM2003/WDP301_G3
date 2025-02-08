const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    fullName:{ 
        type: String 
    },
    phoneNumber: {
        type: String 
    },
    dob: { 
        type: Date 
    },
    address: { 
        type: String 
    },
    roles: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "systemRole" 
    }], 
    userAvatar: {
        type: String 
    }, 
    status: {
        type: String,
        enum: ["active", "inactive", "banned"],
        default: "active" 
    }, 
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "site" 
    }, 
    notifications: [
      {
        _id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "notification" 
        },
        isSeen: { 
            type: Boolean, 
            default: false 
        },
      },
    ],
    activities: [{
         
        type: mongoose.Schema.Types.ObjectId, 
        ref: "activity" 
    }], 
    projects: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "project" 
    }],
    teams: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "team" 
    }], 
    createAt: { 
        type: Date, 
        default: Date.now 
    },
    updateAt: { 
        type: Date, 
        default: Date.now 
    },
  },
  { timestamps: true } 
);

const User = mongoose.model('user', userSchema);
module.exports = User;
