const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


router.get('/', (req, res) => {

    let filters = req.query

    User.find(filters)
        .then(user => {
            res.json({
                confirmation: 'success',
                data: user
            })
        })
        .catch(err => {
            res.json({
                confirmation: 'fail',
                message: err.message
            })
        })
})

router.route('/:id')
    .get((req, res) => {
        const id = req.params.id

        User.findById(id)
            .then(user => {
                res.json({
                    confirmation: 'success',
                    data: user
                })
            })
            .catch(err => {
                res.json({
                    confirmation: 'fail',
                    message: 'User ' + id + ' not found.'
                })
            })
    })

    .put((req, res) => {
        const query = req.body // require: id, key=value
        const userId = req.params.id

        if (!query.password) {
            User.findOneAndUpdate(userId, query, {
                    new: true
                })
                .then(user => {
                    res.json({
                        confirmation: 'success',
                        data: user
                    })
                })
                .catch(err => {
                    res.json({
                        confirmation: 'fail',
                        message: err.message
                    })
                })
        }

        res.json({
            confirmation: 'fail',
            message: 'cannot change password, please remove user ' + userId
        })
    })

    .delete((req, res) => {
        const id = req.params.id

        User.findOneAndDelete(id)
            .then(data => {
                res.json({
                    confirmation: 'success',
                    data: 'User ' + id + ' successfully removed.'
                })
            })
            .catch(err => {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            })
    })


router.post('/', (req, res) => {

    let newUser = new User({        
        email: req.body.email,
        password: req.body.password
    });

    User.generateHash(newUser.password, (err, hash) => {
        if (err) {
            throw err
        }
        newUser.password = hash;
        return newUser.save((err, user) => {
            if (err) {
                res.json({
                    confirmation: 'fail',
                    message: err.message
                })
            }

            res.json({
                confirmation: 'success',
                data: user
            })
        })
    })

})

module.exports = router