const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema({
    sprintName: {
        type: String,
        required: true,
        minlength: 3,
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
    sprintGoal: {
        type: String,

    },
    startDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
        //due date lon hon start date
        validate: {
            validator: function(v) {
                return this.startDate < v;
            },
            message: props => `${props.value} must be greater than start date`
        }
    }
}, { timestamps: true });

const Sprint = mongoose.model("sprint", sprintSchema);
module.exports = Sprint;
