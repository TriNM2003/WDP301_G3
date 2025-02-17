const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true
        //require co tren 3 ki tu
    },
    projectMember: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        roles: [{
            type: String
        }]
    }],
    projectRoles: {
        type: [String],
        default: ['projectMember', 'projectViewer']
    },
    projectStatus: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    projectAvatar: {
        type: String,
        // default: 'default.jpg'
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site',
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model("project", projectSchema);
module.exports = Project;
