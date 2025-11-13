const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Role Schema
const RoleSchema = mongoose.Schema({
    role : {
        type: Number,
        required : true
    },
    name : {
        type : String,
        required : true
    }
});

const Role = module.exports = mongoose.model('Role',RoleSchema,'roles');

module.exports.getRoles = function(callback){ 
    
    return Role.find(callback);
}

module.exports.getRoleByName = function(name,callback){ 
    
    return Role.findOne({name: name},callback);
}


