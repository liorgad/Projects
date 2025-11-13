const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

router.get('/',(req,res)=>{
    res.json({
        confirmation :"success"
    })
})

//Authenticate
router.post('/', (req,res,next) => {

    const userName = req.body.username;
    const password = req.body.password;

    User.findOne(userName, (err,user)=>{
        if(err){            
            throw err;
        }

        if(!user){
            return res.json({success:false, msg: "User not found"});
        }

        User.comparePassword(password, user.password,(err,isMatch)=>{
            if(err){
                throw err;
            }

            if(isMatch){
                
                let payload = {};
                payload.id = user._id;
                payload.name = user.name;
                payload.username = user.username;
                payload.email = user.email;
                payload.password = user.password;

                const token = jwt.sign(payload,config.secret, {
                    expiresIn : 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user : {
                        id : user._id,
                        name : user.name,
                        username : user.username,
                        email : user.email
                    }
                });
            }
            else{
                res.json({
                    success : false,
                    msg : 'Wrong password'
                });
            }
        });

    });
});

module.exports = router