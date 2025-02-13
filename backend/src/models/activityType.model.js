const mongoose = require('mongoose');

const activityType = new mongoose.Schema({
    typeName:{
        type:String,
        required: true,
        unique: true,
        enum:['task','bug','subtask']
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
}, {
    timestamps: true
});

const ActivityType = mongoose.model('activityType', activityType);
module.exports = ActivityType;