const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    sprintName: {
        type: String,
        required: true
        //require co tren 3 ki tu
    },
    sprintStatus: {
        type: String,
        enum: ['planning', 'active', 'completed'],
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
        //due date lon hon start date
    }
}, { timestamps: true });

const Sprint = mongoose.model("sprint", sprintSchema);
module.exports = Sprint;