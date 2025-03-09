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
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activity',
    }],
    startDate: {
        type: Date,

    },
    dueDate: {
        type: Date,

        //due date lon hon start date

        validate: {
            validator: function (v) {
                if (v != null && this.startDate != null) {
                    return this.startDate < v;
                }
            },
            message: props => `${props.value} must be greater than start date`
        }
    }
}, { timestamps: true });

const Sprint = mongoose.model("sprint", sprintSchema);
module.exports = Sprint;
