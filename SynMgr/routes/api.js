const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const config = require('../config/database');
const user = require('./user')
const auth = require('./authenticate')
const profile = require('./profile')

router.use('/user',user)
//router.use('/profile',profile)
router.use('/authenticate',auth)

module.exports = router

// NON-RESTful
// router.get('/user/update', (req, res) => {
// 	const query = req.query // require: id, key=value
// 	const userId = query.id
// 	delete query['id']

// 	User.findByIdAndUpdate(userId, query, {new:true})
// 	.then(profile => {
// 		res.json({
// 			confirmation: 'success',
// 			data: profile
// 		})
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })

// router.put('user/update',(req, res) => {
// 	const query = req.query // require: id, key=value
// 	const userId = query.id
// 	delete query['id']

// 	User.findByIdAndUpdate(userId, query, {new:true})
// 	.then(profile => {
// 		res.json({
// 			confirmation: 'success',
// 			data: profile
// 		})
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })

// router.get('/user/remove', (req, res) => {
// 	const query = req.query

// 	Profile.findByIdAndRemove(query.id)
// 	.then(data => {
// 		res.json({
// 			confirmation: 'success',
// 			data: 'User '+query.id+' successfully removed.'
// 		})
// 	})
// 	.catch(err => {
// 		res.json({
// 			confirmation: 'fail',
// 			message: err.message
// 		})
// 	})
// })