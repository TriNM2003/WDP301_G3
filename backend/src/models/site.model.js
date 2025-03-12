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
    siteSlug:{
        type: String,
        required: true,
        minlength: 3,
    },
    invitations: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },        
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
           // required
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', "expired"],
            default: 'pending'
        },
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
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
    siteStatus: {
        type: String,
        enum: ['active', 'deactivated'],
        default: "active"
    }

}, {timestamps: true});

const Site = mongoose.model("site", siteSchema);
module.exports = Site;
