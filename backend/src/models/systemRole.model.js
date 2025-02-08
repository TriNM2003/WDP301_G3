const mongoose = require('mongoose');

const systemRole = new mongoose.Schema({
    roleName:{
        type:String,
        required: true,
        unique:true
    }
}, {
    timestamps: true
});

const SystemRole = mongoose.model('systemRole', systemRole);
module.exports = SystemRole;