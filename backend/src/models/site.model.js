const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true, 
        //can unique
        //require co tren 3 ki tu
    },
    siteOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    siteMember: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        roles: [{
            type: String
        }]
    }],
    
    invitations: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
           // required
        },
        receivers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }],
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', "expired"],
            default: 'pending'
        },
        expireAt: {
            type: Date
            //tim hieu thoi gian tu dong het han
        }
    }],
    siteAvatar: {
        type: String
        //default: 'default.jpg'
    },

}, {timestamps: true});

const Site = mongoose.model("site", siteSchema);
module.exports = Site;
