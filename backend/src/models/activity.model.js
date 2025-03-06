const mongoose = require('mongoose');
const { create, validate } = require('./user.model');

const activitySchema = new mongoose.Schema({
    activityTitle: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String
    },
    description: {
        type: String,
        default:"medium",
        enum:["lowest","low","medium","high","highest"]
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activity'
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
    createBy: {
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

    attachments: [
        {
            fileName: {
                type: String
            },
            url: {
                type: String
            },
            size: {
                type: Number
            },
            mimeType: {
                type: String
            },
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    startDate: {
        type: Date
    },
    dueDate: {
        type: Date,
        // lon hon hoac bang startDate 
        validate: {
            validator: function (v) {
                if (v != null && this.startDate != null) { 
                return v >= this.startDate;
            }
        },
        message: 'Due date must be greater than or equal to start date'
    }

}
}, { timestamps: true });

const Activity = mongoose.model("activity", activitySchema);
module.exports = Activity;
