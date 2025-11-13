const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const config = require('../config/database');

//Profile
// passport.authenticate protects the profile route
router.get('/profile', passport.authenticate('jwt',{session:false}), (req,res,next) => {
    res.json({user : req.user});
});

module.exports = router