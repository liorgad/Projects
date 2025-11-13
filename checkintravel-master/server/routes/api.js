const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.Promise = require('bluebird');

const roles = require('./rolesRoute');
const locations = require('./locationsRoute');
const users = require('./usersRoute');
const flights = require('./flightsRoute');
const search = require('./searchRoute');
const orders = require('./ordersRoute');
const registermail = require('./registerMailRoute');
const contact = require('./contactRoute');
const log = require('./logRoute');

mongoose.set('useFindAndModify', false);
// Connect
mongoose.connect(config.database, { useNewUrlParser: true }).then(
    () => { console.log('Connected to database ' + config.database); },
    (error) => { console.log('Error connecting to database ' + error); }
);

mongoose.set('useCreateIndex', true);

// router.use(function(req, res, next) {
//     // do logging
//     console.log('Something is happening.');
//     next(); // make sure we go to the next routes and don't stop here
// });

router.use('/roles',roles);

router.use('/locations',locations);

router.use('/users',users);

router.use('/flights',flights);

router.use('/search',search);

router.use('/orders',orders);

router.use('/registermail',registermail);

router.use('/contact',contact);

router.use('/logs',log);

module.exports = router;