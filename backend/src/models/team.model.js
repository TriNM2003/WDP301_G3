const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        minlength: 3,
    },
    teamDescription: {
        type: String,
    },
    teamRoles: [{
        type: String,
        enum: ['teamLeader', 'teamMember'],
        default: 'teamMember'
    }],
    teamMembers: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        roles: [{
            type: String,
            enum: ['teamLeader', 'teamMember'],
        }]
    }],
    teamAvatar: [{
        type: String
    }],
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site',
        required: true
    },
    teamAvatar: {
        type: String,
        default: 'default.jpg'
    },
},{timestamps: true});

const Team = mongoose.model("team", teamSchema);
module.exports = Team;
