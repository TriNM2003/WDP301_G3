const mongoose = require('mongoose');

const stageSchema = new mongoose.Schema({
    stageName: {
        type: String,
        required: true
        //require co tren 3 ki tu
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    stageStatus: {
        type: String,
        enum: ['todo', 'doing', 'done'],
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stage'
    }
}, { timestamps: true });

const Stage = mongoose.model("stage", stageSchema);
module.exports = Stage;
