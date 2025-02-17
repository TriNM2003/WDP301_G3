const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    type: {
        type: String,
        enum: ['system', 'project', 'team', 'site', 'activity'],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Notification = mongoose.model("notification", notificationSchema);
module.exports = Notification;
