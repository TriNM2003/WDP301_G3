const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: 'user'
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
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
