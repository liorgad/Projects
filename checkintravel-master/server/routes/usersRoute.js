const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  Response,
  responseBuilder,
  errorResponse,
  toDate,
  validateEmail
} = require('./common');
const User = require("../model/user");
const Order =  require('../model/order');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const Excel = require('exceljs');
const _ = require('lodash');

// Login
router.post('/login', async (req, res, next) => {

  logger.debug('received POST request for login');

  let credentials = req.body;

  logger.debug(JSON.stringify(credentials, null, 2));

  if (credentials) {
    try {
      let user = await User.findByEmail(credentials.email);

      if (!user) {
        logger.debug('user: ' + credentials.email + " not found")
        res.status(HttpStatus.NOT_FOUND).json({success : false,status: HttpStatus.NOT_FOUND, data:[],message: 'user: ' + credentials.email + " not found"});
        return
      } else {
        logger.debug(JSON.stringify(user, null, 2));

        let isMatch = await User.comparePasswordAsync(credentials.password, user.password)

        // User.comparePassword(credentials.password, user.password, (err, isMatch) => {
        // if (err) {
        //   logger.error("Error comparing password " + err)
        //   throw err;
        // }

        if (isMatch) {
          logger.debug('match !! sigining...');

          let payload = {};
          payload.id = user._id;
          payload.email = user.email;
          payload.password = credentials.password;
          payload.role = user.role;

          logger.debug('Login payload : ' + JSON.stringify(payload, null, 2));

          const token = jwt.sign(payload, config.secret, {
            expiresIn: 604800 // 1 week
            //expiresIn: 1 // 1 sec
          });

          logger.debug('user : ' + JSON.stringify(user, null, 2))

          res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, {
            success: true,
            user: {
              id: user._id,
              email: user.email,
              token: token,
              name: user.manager,
              seatLimit: user.seatLimit
            }
          }, "user authenticated"));
        } else {
          res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Wrong password " + (typeof err == 'object' ? err.message : err)));
        }
      }
    } catch (err) {
      logger.debug('error getting ' + JSON.stringify(credentials.email, null, 2) + " " + err);
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting user " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("Error getting user " + (typeof err == 'object' ? err.message : err)));
  }
});

router.put('/:userId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  const id = req.params.userId;
  const data = req.body;

  logger.debug('Received PUT for id:' + id + ' data:' + JSON.stringify(data));

  if (id && data) {

    try {

      if(!_.isNil(data.password)){
        data.password = await User.encryptPwd(data.password)
      }

      let result = await User.findByIdAndUpdate(id, data);

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'user ' + id + ' updated successfully'));
    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error updating user " + (typeof err == 'object' ? err.message : err)));
    }

  } else {
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("PUT request with no data", HttpStatus.NO_CONTENT));
  }

})

router.delete('/:userId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  const id = req.params.userId;
  logger.debug('Received DELETE for ' + id)

  if (id) {

    try {
      let result = await User.findByIdAndDelete(id);

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'User ' + id + ' successfully deleted'));
    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error deleting user " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("DELETE request with no id", HttpStatus.NO_CONTENT));
  }
});

//Register
router.post('/', passport.authenticate('jwt', {
  session: false
}), async (req, res, next) => {

  // router.post('/', async (req, res, next) => {
  logger.debug('received POST request for regiser');

  let user = req.body;

  logger.debug("REGISTER : user = " + JSON.stringify(user))

  if (user) {
    // TODO: need to hadle password encryption
    let newUser = new User({
      email: user.email,
      password: user.password,
      role: user.role,
      creation_dt: Date.now(),
      manager: user.manager,
      phone: user.phone,
      seatLimit: user.seatLimit,
      fixedPrice: user.fixedPrice,
      currentPrice: user.currentPrice,
      initialCredit: user.initialCredit,
      usedCredit: 0
    });

    try {
      let user = await newUser.save();

      logger.debug("User " + user.email + " successfully added");

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, user, "User " + user.email + " successfully added"));

    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        logger.error(err)

        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("MongoError adding user " + (typeof err == 'object' ? err.message : err)));

      } else {

        logger.error(err)
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error adding user " + (typeof err == 'object' ? err.message : err)));
      }
    }
  }
});

// Get users
router.get('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  try {
    logger.debug('Received GET');

    let data = await User.find().select("-password").populate('role');

    if (data) {
      logger.debug('result ' + data);

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, data, 'GET request for users'));
    }


  } catch (err) {
    logger.debug('Error getting users ' + err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting users " + (typeof err == 'object' ? err.message : err)));
  }
});



router.get('/report', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  // router.post('/combinations/orders', async (req, res) => {

  logger.debug('GET Request for user report')

  let queryParams = req.query;
  // let queryParams = req.body;

  let id = queryParams.id

  if (!validateEmail(id)) {
    logger.error("Id not valid")
    res.status(HttpStatus.BAD_REQUEST).json(responseBuilder(false, HttpStatus.BAD_REQUEST, [], 'Bad id format'));
    return
  }

  logger.debug("user report query params : " + JSON.stringify(queryParams, null, 2));

  try {

    let departureSearch = {
      start: moment().startOf('week'),
    }

    let returnSearch = {

      end: moment().add(1, 'week').startOf('week').add(1, 'day')
    }


    let results = await Order.aggregate()
      .lookup({
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer"
      })
      .unwind('customer')
      .match({
        "customer.email": id
      })
      .project({
        "details.passengers": 1,
        "flight": 1,
        "customer.fixedPrice": 1
      })
      .lookup({
        from: "flightCombinations",
        localField: "flight",
        foreignField: "_id",
        as: "flight"
      })
      .unwind('flight')
      .lookup({
        from: "flights",
        localField: "flight.departure",
        foreignField: "_id",
        as: "flight.departure"
      })
      .unwind('flight.departure')
      .lookup({
        from: "flights",
        localField: "flight.return",
        foreignField: "_id",
        as: "flight.return"
      })
      .unwind('flight.return')
      .match({
        "flight.departure.departure": {
          $gte: departureSearch.start.toDate()
        }
      })
      .match({
        "flight.return.departure": {
          $lte: returnSearch.end.toDate()
        }
      })
      .unwind('details.passengers')
      .project({
        flight: "$flight",
        firstname: "$details.passengers.firstname",
        lastname: "$details.passengers.lastname",
        isInfant: "$details.passengers.isInfant",
        price: "$customer.fixedPrice"
      })
      .lookup({
        from: "locations",
        localField: "flight.departure.origin",
        foreignField: "_id",
        as: "flight.departure.origin"
      })
      .unwind('flight.departure.origin')
      .lookup({
        from: "locations",
        localField: "flight.departure.destination",
        foreignField: "_id",
        as: "flight.departure.destination"
      })
      .unwind('flight.departure.destination')
      .lookup({
        from: "locations",
        localField: "flight.return.destination",
        foreignField: "_id",
        as: "flight.return.destination"
      })
      .unwind("flight.return.destination")
      .project({
        "firstname": 1,
        "lastname": 1,
        "isInfant": 1,
        "price": 1,
        "flight.departure.departure": 1,
        "flight.departure.flightId.airline": 1,
        "flight.departure.origin.airport.englishName": 1,
        "flight.departure.destination.airport.englishName": 1,
        "flight.return.departure": 1,
        "flight.return.flightId.airline": 1,
        "flight.return.destination.airport.englishName": 1
      })
      .project({
        firstname: "$firstname",
        lastname: "$lastname",
        isInfant: "$isInfant",
        price: "$price",
        source: "$flight.departure.origin.airport.englishName",
        destination: "$flight.departure.destination.airport.englishName",
        returnToSource: "$flight.return.destination.airport.englishName",
        departure: "$flight.departure.departure",
        return: "$flight.return.departure",
        departureAirline: "$flight.departure.flightId.airline",
        returnAirline: "$flight.return.flightId.airline"
      })

    //console.log(JSON.stringify(flight, null, 2));        

    // construct a streaming XLSX workbook writer with styles and shared strings
    // var options = {
    //   filename: './' + name + '.xlsx',
    //   useStyles: true,
    //   useSharedStrings: true,

    // };

    let fileName = String(id).replace("@","#") + "_" + departureSearch.start.format("DD.M") + "-" + returnSearch.end.format("DD.M") + '.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    // construct a streaming XLSX workbook writer with styles and shared strings
    var options = {
      stream: res, // stream to server response 
    };


    var workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    //var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

    //var workbook = new Excel.Workbook();

    workbook.addWorksheet('Sheet 1', {
      properties: {
        showGridLines: true
      },
      view: [{
        rightToLeft: false
      }]
    });


    var worksheet = workbook.getWorksheet('Sheet 1');

    worksheet.columns = [{
        header: 'LAST NAME',
        key: 'lastname'
      },
      {
        header: 'FIRST NAME',
        key: 'firstname'
      },
      {
        header: 'REMARK',
        key: 'remark'
      },
      {
        header: 'DATE',
        key: 'date'
      },
      {
        header: 'PRICE IN $',
        key: 'price'
      }
    ];

    results.forEach(element => {
      worksheet.addRow({
        lastname: element.lastname,
        firstname: element.firstname,
        remark: element.source + "-" + element.destination + "-" + element.returnToSource + " (" + element.departureAirline + " " + moment(element.departure).format("HH:mm") + "-" + element.returnAirline + " " + moment(element.return).format("HH:mm") + ")",
        date: moment(element.departure).format("DD.M") + "-" + moment(element.return).format("DD.M"),
        price: element.isInfant ? 75 : element.price
      }).commit()
    })

    worksheet.commit()

    // let streaRes = await workbook.xlsx.write(res);

    let commitRes = await workbook.commit()

    logger.debug(commitRes);

    // res.sendFile(options.filename,{root : './'})

    //res.download(options.filename)

    // res.status(HttpStatus.OK).json(responseBuilder(true,HttpStatus.OK,[], "Flight orders summary created successfully"));

  } catch (err) {

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting flight combinations " + (typeof err == 'object' ? err.message : err)));
  }

})



module.exports = router;
