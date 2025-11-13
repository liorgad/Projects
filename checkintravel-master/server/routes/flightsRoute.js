const logger = require('../lib/logger');
const {
  Response,
  responseBuilder,
  errorResponse,
  toDate
} = require('./common');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Flight = require('../model/flight')
const HttpStatus = require('http-status-codes');
const FlightCombination = require('../model/flightCombination');
const mongoose = require('mongoose');
const _ = require('lodash');
const Airline = require('../model/airline');
const {
  ObjectID
} = require('mongodb');
const Excel = require('exceljs');
const moment = require('moment');


router.get('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('GET Request for flights')

  try {

    const flights = await Flight.find().populate('origin').populate('destination').populate('return').exec()
    logger.debug("GET flights query result : " + JSON.stringify(flights, null, 2))

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, flights, "OK"));
  } catch (err) {
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting flights " + (typeof err == 'object' ? err.message : err)));
  }

})

router.post('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received POST request for flight');

  let flight = req.body;

  logger.debug("POST body : " + JSON.stringify(flight));

  if (flight) {

    try {
      let dep = toDate(flight.departure, flight.departureTime);
      let arr = toDate(flight.arrival, flight.arrivalTime);

      let prefix = flight.flightId.slice(0, 2).toUpperCase()

      let newFlight = new Flight({
        flightId: {
          airline: prefix,
          number: Number.parseInt(flight.flightId.slice(2), 10)
        },
        airlineName: flight.airlineName._id,
        departure: dep,
        arrival: arr,
        costPrice: flight.sale ? flight.costPrice : flight.price,
        salePrice: flight.sale ? flight.salePrice : flight.price,
        price: flight.price,
        isOnSale: flight.sale,
        seats: flight.seats,
        // direction: flight.direction,
        origin: flight.origin._id,
        destination: flight.destination._id,
        create_dt: Date.now()
      });


      let data = await newFlight.save()
      logger.debug("Flight save to DB result : " + JSON.stringify(data));

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, data, "flight " + flight.flightId + " successfully registered"));

    } catch (err) {

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error creating flight " + (typeof err == 'object' ? err.message : err)));
    }
  }
})

router.put('/:flightId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received PUT request for flight');

  const id = req.params.flightId;
  const data = req.body;

  logger.debug("PUT request data : " + JSON.stringify(data, null, 2))

  if (id && data) {
    try {
      data.departure = toDate(data.departure, data.departureTime);
      data.arrival = toDate(data.arrival, data.arrivalTime);

      let prefix = data.flightId.slice(0, 2).toUpperCase()

      data.flightId = {
        airline: prefix,
        number: Number.parseInt(data.flightId.slice(2), 10)
      }

      let result = await Flight.findByIdAndUpdate(id, data)

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'flight ' + id + ' updated successfully'));

    } catch (err) {
      logger.error("Error updaing flight " + err)

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error updating flight " + (typeof err == 'object' ? err.message : err)));
    }
  } else {

    res.status(HttpStatus.NO_CONTENT).json(errorResponse("PUT request with no data", HttpStatus.NO_CONTENT));
  }

})

router.delete('/:flightId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  logger.debug('received DELETE request for flight');

  const id = req.params.flightId;

  if (id) {
    Flight.findByIdAndRemove(id).then(
      (result) => {

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'flight ' + id + ' successfully deleted'));

      },
      (err) => {

        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error deleting flight " + (typeof err == 'object' ? err.message : err)));
      })
  } else {

    res.status(HttpStatus.NO_CONTENT).json(errorResponse("DELETE request with no id", HttpStatus.NO_CONTENT));
  }
})

router.get('/combinations', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  logger.debug('GET Request for flights')

  try {

    const flights = await FlightCombination.find().populate('departure').populate('return')
    logger.debug("GET flight combinations query result : " + JSON.stringify(flights))

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, flights, "GET flight combinations OK"));

  } catch (err) {

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting flight combinations " + (typeof err == 'object' ? err.message : err)));
  }

})

router.get('/combinations/orders', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  // router.post('/combinations/orders', async (req, res) => {

  logger.debug('GET Request for flights orders')

  let queryParams = req.query;
  // let queryParams = req.body;

  let id = queryParams.id

  if (!ObjectID.isValid(id)) {
    logger.error("Id not valid")
    res.status(HttpStatus.BAD_REQUEST).json(responseBuilder(false, HttpStatus.BAD_REQUEST, [], 'Bad id format'));
    return
  }

  logger.debug("flight orders query params : " + JSON.stringify(queryParams, null, 2));

  try {

    // const flights = await FlightCombination.findById(queryParams.id).populate('departure').populate('return');
    // logger.debug("GET flight combinations query result : " + JSON.stringify(flights))  
    let result = await FlightCombination.aggregate()
      .match({
        _id: mongoose.Types.ObjectId(id)
      })
      .lookup({
        from: "flights",
        localField: "departure",
        foreignField: "_id",
        as: "departure"
      })
      .lookup({
        from: "flights",
        localField: "return",
        foreignField: "_id",
        as: "return"
      })
      .project({
        "departure.orders": 1,
        "return.orders": 1
      })
      .unwind("departure", "return")
      .unwind("departure.orders", "return.orders")
      .project({
        orders: ["$departure.orders", "$return.orders"]
      })
      .unwind("orders")
      .group({
        _id: null,
        uniqueValues: {
          $addToSet: "$orders"
        }
      })
      .unwind("$uniqueValues")
      .lookup({
        from: "orders",
        localField: "uniqueValues",
        foreignField: "_id",
        as: "orders"
      })
      .project({
        passengers: "$orders.details.passengers"
      })
      .unwind("passengers")
      .exec()

    logger.debug("Orders aggregation : " + JSON.stringify(result, null, 2));

    let flight = await FlightCombination.findById(id)

    let name = String(flight.departure.origin.airport.englishName) + "-" +
      String(flight.departure.destination.airport.englishName) + " " +
      moment(flight.departure.departure).format("DD MMM").toString() + " " +
      String(flight.departure.flightId.airline) + " " +
      moment(flight.departure.departure).format("HH_mm").toString()

    //console.log(JSON.stringify(flight, null, 2));        

    // construct a streaming XLSX workbook writer with styles and shared strings
    // var options = {
    //   filename: './' + name + '.xlsx',
    //   useStyles: true,
    //   useSharedStrings: true,

    // };

    let fileName = name + '.xlsx';
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
        header: 'LastName',
        key: 'lastname'
      },
      {
        header: 'FirstName',
        key: 'firstname'
      },
      {
        header: 'TITLE',
        key: 'title'
      },
      {
        header: name,
        key: 'flightid'
      }
    ];

    result[0].passengers.forEach(element => {
      worksheet.addRow({
        lastname: element.lastname,
        firstname: element.firstname,
        title: element.isInfant ? '' : (element.gender == "M" ? "MR" : "MRS")
      })
    });

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

router.post('/combinations', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received POST request for flight combinations');

  let flightCombination = req.body;

  logger.debug("POST body : " + JSON.stringify(flightCombination));

  if (flightCombination) {
    try {

      let results = await Flight.find({
          _id: {
            $in: [mongoose.Types.ObjectId(flightCombination.departure._id), mongoose.Types.ObjectId(flightCombination.arrival._id)]
          }
        })
        .select('costPrice');


      let totalCost = results.map(result => result.costPrice).reduce((prev, next) => prev + next);

      let flightComb = new FlightCombination({
        departure: mongoose.Types.ObjectId(flightCombination.departure._id),
        return: mongoose.Types.ObjectId(flightCombination.arrival._id),
        costPrice: totalCost,
        salePrice: flightCombination.salePrice,
        price: flightCombination.price,
        isOnSale: flightCombination.isOnSale,
        create_dt: Date.now(),
      })

      let data = await flightComb.save()
      logger.debug("Flight save to DB result : " + JSON.stringify(data));

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, data, "flightCombination successfully registered"));

    } catch (err) {

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error registering flightCombination " + (typeof err == 'object' ? err.message : err)));
    }
  }
})

router.put('/combinations/:combinationId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received PUT request for combination');

  const id = req.params.combinationId;
  const data = req.body;

  if (id && data) {
    try {

      let result = await FlightCombination.findByIdAndUpdate(id, data)

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'flightCombination ' + id + ' updated successfully'));

    } catch (err) {
      logger.error("Error updaing flightCombination " + err)

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error updaing flightCombination " + (typeof err == 'object' ? err.message : err)));
    }
  } else {

    res.status(HttpStatus.NO_CONTENT).json(errorResponse("PUT request with no data", HttpStatus.NO_CONTENT));
  }

})

router.delete('/combinations/:combinationId', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  logger.debug('received DELETE request for flightCombination');

  const id = req.params.combinationId;

  if (id) {
    FlightCombination.findByIdAndRemove(id).then(
      (result) => {

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'flightCombination ' + id + ' successfully deleted'));
      },
      (err) => {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error deleting flightCombination " + (typeof err == 'object' ? err.message : err)));
      })
  } else {
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("DELETE request with no id", HttpStatus.NO_CONTENT));
  }
})

router.get('/airlines', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  logger.debug('GET Request for airlines')

  try {

    const airlines = await Airline.find();
    logger.debug("GET airlines query result : " + JSON.stringify(airlines))

    let airlineResult = []

    airlines.forEach(airline => airlineResult.push({
      _id: airline._id,
      name: airline.name,
      img: airline.img.contentType + ',' + airline.img.data.toString('base64')
    }))

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, airlineResult, "GET airlines OK"));

  } catch (err) {

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting airlines combinations " + (typeof err == 'object' ? err.message : err)));
  }

})

router.post('/airlines', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received POST request for airlines');

  let airline = req.body;

  logger.debug("POST body : " + JSON.stringify(airline));

  if (airline) {
    try {

      const imageObj = getImageObject(airline);

      let airlineModel = new Airline({
        name: airline.name,
        img: {
          contentType: imageObj.type,
          data: imageObj.buffer
        },
        create_dt: Date.now(),
      })

      let result = await airlineModel.save()
      logger.debug("Airline save to DB result : " + JSON.stringify(result));

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "airline successfully registered"));

    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error registering airline " + (typeof err == 'object' ? err.message : err)));
    }
  }
})

router.put('/airlines/:airlineId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received PUT request for airlines');

  const id = req.params.airlineId;
  const data = req.body;

  if (id && data) {
    try {
      if (!_.isEmpty(data.img)) {
        const imageObj = getImageObject(data);

        let result = await Airline.findByIdAndUpdate(id, {
          name: data.name,
          img: {
            contentType: imageObj.type,
            data: imageObj.buffer
          }
        })

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'airline ' + id + ' updated successfully'));
      } else {

        let result = await Airline.findByIdAndUpdate(id, data)

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'airline ' + id + ' updated successfully'));
      }

    } catch (err) {
      logger.error("Error updaing airline " + err)

      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error updaing airline " + (typeof err == 'object' ? err.message : err)));
    }
  } else {

    res.status(HttpStatus.NO_CONTENT).json(errorResponse("PUT request with no data", HttpStatus.NO_CONTENT));
  }

})

router.delete('/airlines/:airlineId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('received DELETE request for airline');

  const id = req.params.airlineId;

  if (id) {
    try {
      let result = await Airline.findByIdAndRemove(id)

      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'airline ' + id + ' successfully deleted'));
    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error deleting airline " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("DELETE request with no id", HttpStatus.NO_CONTENT));
  }
})

module.exports = router;

function getImageObject(airline) {
  const data = airline.img;
  const split = data.split(','); // or whatever is appropriate here. this will work for the example given
  const type = split[0];
  const base64string = split[1];
  const buffer = new Buffer(base64string, "base64")
  return {
    buffer,
    type
  };
}
