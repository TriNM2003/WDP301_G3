const mongoose = require('mongoose');
const { create } = require('./user.model');

const activitySchema = new mongoose.Schema({
    activityTitle: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sprint'
    },
    stage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stage',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activityType',
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    assignee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        commenter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }   
    }],
    startDate: {
        type: Date
    },
    dueDate: {
        type: Date
        // lon hon hoac bang startDate 
    }
}, { timestamps: true });

const Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
