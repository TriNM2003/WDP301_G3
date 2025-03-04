const mongoose = require('mongoose');

const systemRoleSchema = new mongoose.Schema({
    roleName:{
        type:String,
        required: true,
        unique:true,
        enum: ["user", "admin"],
    }
});

const SystemRole = mongoose.model('systemRole', systemRoleSchema);
module.exports = SystemRole;