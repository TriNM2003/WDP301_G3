const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        minlength: 3,
        
    },
    projectMember: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        roles: [{
            type: String,
            enum: ['projectManager', 'projectMember'],
        }]
    }],
    projectSlug:{
        type: String,
        required: true,
        minlength: 3,
    },
    projectStatus: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    projectRoles: [{
        type: String,
        default: ['projectManager', 'projectMember'],
    }],
    projectAvatar: {
        type: String,
        default: 'default.jpg'
    },
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site',
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model("project", projectSchema);
module.exports = Project;
