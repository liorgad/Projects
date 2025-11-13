const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



//User Schema
const UserSchema = mongoose.Schema({
    _userId : {
        type : Schema.Types.ObjectId,
        required : true       
    },
    firstName : {
        type :String,
        required : true,
        trim:true,
        default: ''
    },    
    lastName : {
        type : String,
        required : true,
        trim:true,
        default: '' 
    },
    homePhone : {
        type : String,        
        trim:true,
        default: '' 
    },
    cellPhone : {
        type : String,
        required : true,
        trim:true,
        default: '' 
    },
    address  :{
        street : {type : String, required : true,default : '',trim : true},
        number : {type: Number, required : true},
        neighberhood : {type : String, trim : true, default : ''},
        city : {type : String, trim : true, default : ''}
    },
    member : {
        type : Schema.ObjectId,
        required : true
    },
    status : {
        type : Schema.ObjectId
    },
    role : {
        type: ObjectId,
        required : true
    }
});

const Profile = module.exports = mongoose.model('Profile',ProfileSchema);

