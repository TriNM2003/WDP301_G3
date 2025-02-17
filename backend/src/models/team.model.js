const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
        //require co tren 3 ki tu
    },
    teamLeader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site',
        required: true
    },
},{timestamps: true});

const Team = mongoose.model("team", teamSchema);
module.exports = Team;
