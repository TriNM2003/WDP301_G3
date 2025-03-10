const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true, 
        unique: true,
        minlength: 3,
    },
    siteRoles: [{
        type: String,
        default: ['siteOwner', 'siteMember'],
    }],
    siteMember: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        roles: [{
            type: String,
            enum: ['siteOwner', 'siteMember'],
        }]
    }],
    
    invitations: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
           // required
        },
        receivers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        }],
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', "expired"],
            default: 'pending'
        },
        expireAt: {
            type: Date,
            //tim hieu thoi gian tu dong het han
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }   
    }],
    siteAvatar: {
        type: String,
        default: 'default.jpg'
    },
    siteDescription: {
        type: String
    },

}, {timestamps: true});

const Site = mongoose.model("site", siteSchema);
module.exports = Site;
