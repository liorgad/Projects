const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({    
    email : {
        type :String,
        required : true,
        trim:true,
        default: ''
    },    
    password : {
        type : String,
        required : true,
        trim:true,
        default: '' 
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

const comparePassword = module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

const generateHash = module.exports.generateHash = (password, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            callback(err, hash)
        });
    });
}