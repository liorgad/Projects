const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique : true,
        trim: true                
    },
    password: {
        type: String,
        required: true
    },
    //username: {type:String, require:true},
    creation_dt: { type: Date, require: true },
    role: {type: mongoose.Schema.Types.ObjectId,ref : 'Role' },
    manager: {type : String},
    phone:  {
        type: String,
        required: true
    },
    seatLimit:  {
        type: String,
        required: true
    },
    fixedPrice: Number,
    currentPrice: Number,
    initialCredit: { type: Number,default : 0},
    usedCredit: { type: Number,default : 0}
});

UserSchema.pre('save', function (next) {
    var self = this;    
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;  
            next();
        });
    });  
}) ;

// UserSchema.statics.hashPassword = function hashPassword(password){
//     return bcrypt.hashSync(password,10);
// }

UserSchema.methods.isValid = function(hashedpassword){    
    return  bcrypt.compareSync(hashedpassword, this.password);
}

const User = module.exports = mongoose.model('User', UserSchema, 'users');

module.exports.findByEmail = function (email) {
    const query = { email: email };    
    return User.findOne(query).populate('role');
}

module.exports.getUserById = function (id, callback) {    
   // User.findOne({ _id : id},callback);
   User.findById(id, callback);
};

module.exports.encryptPwd = async function(password){

    try{
        let salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password,salt)
    }
    catch(err)
    {
        logger.error("Password encrypt error, " + err)
        return null
    }
    

    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(password, salt, (err, hash) => {
    //         if (err) return next(err);
    //         return hash;              
    //     });
    // });  
}

// module.exports.getUserByUsername = function(username,callback){
//     const query = {username:username};  
//     console.log(query);    
//     User.findOne(query,callback);
// };

module.exports.addUser = function (newUser, callback) {

    User.findByEmail(newUser.email, (err, user) => {
        if (err) {
            callback(err, null)
        }
        else if (user) {
            callback(null, null)
        }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    console.log('addUser: calling save');
                    newUser.save(callback);
                });
            });
        }
    })


};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.comparePasswordAsync = function (candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
}

