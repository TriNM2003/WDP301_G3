const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
    typeName:{
        type:String,
        required: true,
        unique: true,
        enum:['task','bug','subtask']
    },
});

const ActivityType = mongoose.model('activityType', activityTypeSchema);
module.exports = ActivityType;
