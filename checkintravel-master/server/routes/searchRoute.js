const _ = require('lodash');
const {
  Response,
  responseBuilder,
  errorResponse,
  toDate,
  INFANT_PRICE
} = require('./common');
const {
  builderEticketHtml,
  htmlToPDFFile,
  builderEmailHtml
} = require('../lib/eticketBuiler')
const express = require('express');
const router = express.Router();
const Flight = require('../model/flight')
const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const FlightCombinations = require('../model/flightCombination');
const Order = require('../model/order');
const User = require('../model/user');
const {
  sendMail,
  createEticket
} = require('../model/mail');

const {
  placeCreditCardPayment
} = require("../lib/payment");

const Payment = require('../model/creditCard');


router.get('/', async (req, res) => {
  logger.debug("Received GET request");

  let queryParams = req.query;

  logger.debug("Search query params : " + JSON.stringify(queryParams, null, 2));

  if (queryParams &&
    (!_.isEmpty(queryParams.adults)) &&
    (!_.isEmpty(queryParams.infants))) {

    try {

      let fromDate = new Date(queryParams.fromDate);

      let result = await FlightCombinations.find()
        .select(['-costPrice', '-isOnSale', '-salePrice']);

      let resultMsg = {
        msg: "",
        success: true
      }

      result = result.filter(fc => {
        return moment(fc.departure.departure).isSame(fromDate, 'day')
      })

      if (result.length == 0) {
        resultMsg.msg = "no flights on requested from date " + fromDate
        resultMsg.success = false
        logger.info(resultMsg.msg)
      }

      result = result.filter(fc => fc.departure.origin.id === queryParams.origin)

      if (result.length == 0) {
        resultMsg.msg = "no flights on origin request "
        resultMsg.success = false
        logger.info(resultMsg.msg)
      }

      result = result.filter(fc => fc.departure.destination.id === queryParams.destination)

      if (result.length == 0) {
        resultMsg.msg = "no flights on destination request "
        resultMsg.success = false
        logger.info(resultMsg.msg)
      }

      let adults = Number(queryParams.adults)

      result = result.filter(fc => (
        ((fc.departure.seats - fc.departure.orderedSeats) >= adults) &&
        (!_.isNil(fc.return) ? ((fc.return.seats - fc.return.orderedSeats) >= adults) : true)
      ))

      if (result.length == 0) {
        resultMsg.msg = "no available seats on requested dates"
        resultMsg.success = false
        logger.info(resultMsg.msg)
      }

      let user = {}
      if (!_.isNil(queryParams.username)) {
        user = await User.findByEmail(queryParams.username)
      }

      let infants = Number(queryParams.infants)

      result.forEach(fc => {

        if (!_.isNil(user) && !_.isEmpty(user)) {
          fc.totalPrice = ((adults * user.fixedPrice) + (infants * INFANT_PRICE))
          fc.price = user.fixedPrice
          if (!_.isNil(fc.return) && !_.isEmpty(fc.return)) {
            fc.price = fc.price * 2;
            fc.totalPrice = fc.totalPrice * 2
          }
        } else {
          fc.totalPrice = ((adults * (fc.departure.isOnSale ? fc.departure.salePrice : fc.departure.price) + (infants * INFANT_PRICE)))
          fc.price = fc.departure.isOnSale ? fc.departure.salePrice : fc.departure.price
          if (!_.isNil(fc.return) && !_.isEmpty(fc.return)) {
            fc.totalPrice += ((adults * (fc.return.isOnSale ? fc.return.salePrice : fc.return.price) + (infants * INFANT_PRICE)))
            fc.price += fc.return.isOnSale ? fc.return.salePrice : fc.return.price
          }
        }
        fc.availableSeats.departure = fc.departure.seats - fc.departure.orderedSeats
        fc.departure = _.omit(fc.departure, ['costPrice', 'isOnSale', 'salePrice', 'orders', 'orderedSeats'])
      })

      if (!_.isNil(queryParams.toDate)) {
        let toDate = new Date(queryParams.toDate);

        result = result.filter(fc => fc.return ? (moment(fc.return.departure).isSame(toDate, 'day')) : false)

        if (result.length == 0) {
          resultMsg.msg = "no available seats on requested dates"
          resultMsg.success = false
          logger.info(resultMsg.msg)
        }

        logger.debug("Search result with toDate : " + JSON.stringify(result, null, 2))
      }

      result.forEach(fc => {
        if (!_.isNil(fc.return)) {
          fc.availableSeats.return = fc.return.seats - fc.return.orderedSeats
          fc.return = _.omit(fc.return, ['costPrice', 'isOnSale', 'salePrice', 'orders', 'orderedSeats'])
        }
      })

      if (resultMsg.success) {
        logger.debug("Search result  : " + JSON.stringify(result, null, 2))
        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "OK"));
      } else {
        res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.NOT_FOUND, [], resultMsg.msg))
      }

    } catch (error) {
      logger.error("Error getting search results " + error.message)
      res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NOT_FOUND, [], error.message))
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT, []))
  }
})

router.get('/sales', async (req, res) => {
  logger.debug("Received sales GET request");

  try {
    let fromDate = moment();
    let result = await FlightCombinations.where('isOnSale').equals(true)
      .populate({
        path: 'departure',
        select: 'departure destination'
      })
      .populate({
        path: 'destination'
      })
      .populate({
        path: 'return',
        select: 'departure destination'
      })
      .populate({
        path: 'destination'
      })
      .select('-costPrice -create_dt')

    result = result.filter(fc => moment(fc.departure.departure).isSameOrAfter(fromDate, 'day'))

    result.forEach(fc => {

      fc.price = fc.departure.isOnSale ? fc.departure.salePrice : fc.departure.price
      if (!_.isNil(fc.return) && !_.isEmpty(fc.return)) {
        fc.price += fc.return.isOnSale ? fc.return.salePrice : fc.return.price
      }

      fc.availableSeats.departure = fc.departure.seats - fc.departure.orderedSeats

      if (!_.isNil(fc.return)) {
        fc.availableSeats.return = fc.return.seats - fc.return.orderedSeats
        fc.return = _.omit(fc.return, ['costPrice', 'isOnSale', 'salePrice', 'orders', 'orderedSeats'])
      }

      fc.departure = _.omit(fc.departure, ['costPrice', 'isOnSale', 'salePrice', 'orders', 'orderedSeats'])
    })

    logger.debug("Search result : " + JSON.stringify(result, null, 2))

    if (result.length < 3) {
      result = []
      res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.OK, result, "OK"));
    } else {
      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "OK"));
    }
  } catch (err) {
    logger.error(err);
    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting sales " + (typeof err == 'object' ? err.message : err)));
  }
})

router.post('/placeOrder', async (req, res) => {
  logger.debug('Received POST request')

  const data = req.body;

  logger.debug("Place Order POST : " + JSON.stringify(data, null, 2))

  if (data) {
    if (!_.isNil(data.details) && data.details.isConfirmed) {
      try {

        let flightCombResult = await FlightCombinations.findById(data.flight._id)

        let totalSeats = data.seats.adults // + data.seats.infants
        let hasDepartureSeats = (flightCombResult.departure.seats - flightCombResult.departure.orderedSeats) >= totalSeats
        let hasReturn = !_.isNil(flightCombResult.return)
        let hasReturnSeats = hasReturn && ((flightCombResult.return.seats - flightCombResult.return.orderedSeats) >= totalSeats)
        //validate seats
        if ((!hasReturn && hasDepartureSeats) || (hasReturn && hasDepartureSeats && hasReturnSeats)) {

          //let user = data.customer ? await User.findById(data.customer.id) : null

          let user = await User.findByEmail(data.username);

          if (!_.isNil(user)) {
            let isMatch = await User.comparePasswordAsync(data.password, user.password);

            let isUserAllowed = isMatch && ((user.usedCredit + (user.fixedPrice * totalSeats)) <= user.initialCredit) && totalSeats <= user.seatLimit

            let orderResult = {};

            if (isUserAllowed) {

              // price calculation
              let finalPrice = ((data.seats.adults * user.fixedPrice) + (data.seats.infants * INFANT_PRICE))
              finalPrice = hasReturn ? finalPrice * 2 : finalPrice

              orderResult = await placeOrder(data, totalSeats, user, flightCombResult, finalPrice, data.seats);

              if (!_.isNil(orderResult) && _.isEmpty(data.credit)) {
                let updatedUser = await User.findByIdAndUpdate(user._id, {
                  $inc: {
                    usedCredit: finalPrice
                  }
                })

                logger.debug("PlaceOrder UpdatedUser : " + JSON.stringify(updatedUser, null, 2))

                let passengers = data.details.passengers
                let orderId = orderResult.orderId
                let isConfirmed = !_.isEmpty(orderResult)
                let order_time = new Date(orderResult.order_dt)

                let departure = {
                  id: flightCombResult.departure.flightId.airline + " " + String(flightCombResult.departure.flightId.number),
                  airline: flightCombResult.departure.airlineName.name,
                  dt: flightCombResult.departure.departure,
                  origin: flightCombResult.departure.origin,
                  arrival: flightCombResult.departure.arrival,
                  destination: flightCombResult.departure.destination
                }

                let returnFlight = {
                  id: flightCombResult.return.flightId.airline + " " + String(flightCombResult.return.flightId.number),
                  airline: flightCombResult.return.airlineName.name,
                  dt: flightCombResult.return.departure,
                  origin: flightCombResult.return.origin,
                  arrival: flightCombResult.return.arrival,
                  destination: flightCombResult.return.destination
                }

                let emailHtml = builderEmailHtml(orderId, isConfirmed, order_time, passengers, departure, returnFlight, orderResult.id)
                //let eticketHtml = builderEticketHtml(orderId, isConfirmed, order_time, passengers, departure, returnFlight)

                //await htmlToPDFFile(eticketHtml,'./eTicket.pdf')

                let sendmailResult = await sendMail("checkintravel.flying@gmail.com", data.details.email, "Flight Order", emailHtml)

                logger.debug("Order mail send : " + JSON.stringify(sendmailResult, null, 2))


              } else if (!_.isNil(orderResult)) {
                logger.debug("PlacedOrder with credit card")
              } else {
                logger.error("Error placing order")
                res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.OK, [], 'Order failed !'));
                return
              }

              res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, orderResult, 'Order completed !'));
            } else {
              logger.alert("Not enough credits left for user or over seats limit, order paramters: " + JSON.stringify(data, null, 2))
              res.status(HttpStatus.METHOD_NOT_ALLOWED).json(responseBuilder(false, HttpStatus.METHOD_NOT_ALLOWED, [], 'Not enough cedits left for user'));
            }
          } else {

            // price calculation
            let finalPrice = ((data.seats.adults * (flightCombResult.departure.isOnSale ? flightCombResult.departure.salePrice : flightCombResult.departure.price) + (data.seats.infants * INFANT_PRICE)))
            finalPrice = hasReturn ? finalPrice + ((data.seats.adults * (flightCombResult.return.isOnSale ? flightCombResult.return.salePrice : flightCombResult.return.price) + (data.seats.infants * INFANT_PRICE))) : finalPrice

            orderResult = await placeOrder(data, totalSeats, user, flightCombResult, finalPrice, data.seats);

            if (_.isNil(orderResult)) {
              logger.error("PlaceOrder failed ")
              res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.OK, [], 'Order failed !'));
              return
            }

            logger.debug("PlaceOrder orderResult : " + JSON.stringify(orderResult, null, 2))

            let passengers = data.details.passengers
            let orderId = orderResult.orderId
            let isConfirmed = !_.isEmpty(orderResult)
            let order_time = new Date(orderResult.order_dt)

            let departure = {
              id: flightCombResult.departure.flightId.airline + " " + String(flightCombResult.departure.flightId.number),
              airline: flightCombResult.departure.airlineName.name,
              dt: flightCombResult.departure.departure,
              origin: flightCombResult.departure.origin,
              arrival: flightCombResult.departure.arrival,
              destination: flightCombResult.departure.destination
            }

            let returnFlight = {
              id: flightCombResult.return.flightId.airline + " " + String(flightCombResult.return.flightId.number),
              airline: flightCombResult.return.airlineName.name,
              dt: flightCombResult.return.departure,
              origin: flightCombResult.return.origin,
              arrival: flightCombResult.return.arrival,
              destination: flightCombResult.return.destination
            }

            let emailHtml = builderEmailHtml(orderId, isConfirmed, order_time, passengers, departure, returnFlight, orderResult.id)
            //let eticketHtml = builderEticketHtml(orderId, isConfirmed, order_time, passengers, departure, returnFlight)

            //await htmlToPDFFile(eticketHtml,'./eTicket.pdf')

            let sendmailResult = await sendMail("checkintravel.flying@gmail.com", data.details.email, "Flight Order", emailHtml)

            logger.debug("Order mail send : " + JSON.stringify(sendmailResult, null, 2))

            res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, orderResult, 'Order completed !'));
          }
        } else {
          logger.error("'Not enough seats available'")
          res.status(HttpStatus.METHOD_NOT_ALLOWED).json(responseBuilder(false, HttpStatus.METHOD_NOT_ALLOWED, flightResult, 'Not enough seats available'));
        }

      } catch (err) {
        logger.error("Error placing order : " + JSON.stringify(err.message, null, 2))
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR, [], "Error getting flights " + (typeof err == 'object' ? err.message : err)))
      }
    } else {
      logger.error("Legal Terms not confirmed")
      res.status(HttpStatus.UNAUTHORIZED).json(responseBuilder(false, HttpStatus.UNAUTHORIZED, [], "Legal Terms not confirmed"))
    }
  } else {
    logger.error("Error no parameters ")
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT, [], "Error no parameters "))
  }
})

router.get('/clientOrders', async (req, res) => {
  logger.debug("Received ClientOrders GET request");

  let queryParams = req.query;

  logger.debug("ClientOrders query params : " + JSON.stringify(queryParams, null, 2));

  if (queryParams && !_.isEmpty(queryParams)) {

    try {

      let user = await User.findByEmail(queryParams.email).select('-password');

      logger.debug("User found : " + JSON.stringify(user, null, 2))

      if (user) {

        if (user.role.role <= 3) {

          let departureSearch = {
            start: moment().startOf('week'),
            end: moment().endOf('week')
          }

          let returnSearch = {
            start: moment().startOf('week').add(4, 'day'),
            end: moment().add(1, 'week').startOf('week').add(1, 'day')
          }

          logger.debug("Order search date parameters : start " + JSON.stringify(departureSearch, null, 2) + " end " + JSON.stringify(returnSearch, null, 2))

          // let result = await Order.where('customer').ne(null).select(['flight', 'details', 'customer'])
          // .where("$customer.email").equals(queryParams.email)

          let result = await Order.aggregate()
            .lookup({
              from: "users",
              localField: "customer",
              foreignField: "_id",
              as: "customer"
            }).unwind('customer')
            .match({
              "customer.email": queryParams.email
            })
            .lookup({
              from: "flightCombinations",
              localField: "flight",
              foreignField: "_id",
              as: "flight"
            }).unwind('flight')
            .lookup({
              from: "flights",
              localField: "flight.departure",
              foreignField: "_id",
              as: "flight.departure"
            }).unwind('flight.departure')
            .lookup({
              from: "flights",
              localField: "flight.return",
              foreignField: "_id",
              as: "flight.return"
            }).unwind('flight.return')
            .lookup({
              from: "locations",
              localField: "flight.departure.origin",
              foreignField: "_id",
              as: "flight.departure.origin"
            }).unwind('flight.departure.origin')
            .lookup({
              from: "locations",
              localField: "flight.departure.destination",
              foreignField: "_id",
              as: "flight.departure.destination"
            }).unwind('flight.departure.destination')
            .lookup({
              from: "locations",
              localField: "flight.return.origin",
              foreignField: "_id",
              as: "flight.return.origin"
            }).unwind('flight.return.origin')
            .lookup({
              from: "locations",
              localField: "flight.return.destination",
              foreignField: "_id",
              as: "flight.return.destination"
            }).unwind('flight.return.destination')


          logger.debug("Orders search result : " + JSON.stringify(result, null, 2))

          result = result.filter(order => {
            if (!_.isNil(order.flight.return)) {
              return (moment(order.flight.departure.departure).isSameOrAfter(departureSearch.start)) &&
                (moment(order.flight.return.departure).isSameOrBefore(returnSearch.end))
            }
            return (moment(order.flight.departure.departure).isSameOrAfter(departureSearch.start))
          })

          logger.debug("Orders after duration result : " + JSON.stringify(result, null, 2))

          result.forEach(order => {
            order.flight.departure = _.pick(order.flight.departure, ['departure', 'origin', 'destination'])
            order.flight.return = _.pick(order.flight.return, ['departure', 'origin', 'destination'])
            order.flight = _.pick(order.flight, ['departure', 'return'])
            order.customer = _.pick(order.customer, ['email', 'manager', 'phone', 'initialCredit', 'usedCredit'])
            order = _.pick(order, ['details', 'customer', 'flight'])
          })

          res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "OK"));
        } else {
          logger.warn("User " + user.email + " role unauthorized")
          res.status(HttpStatus.UNAUTHORIZED).json(responseBuilder(false, HttpStatus.UNAUTHORIZED, [], "User " + user.email + " role unauthorized"));
        }
      } else {
        logger.warn("User " + user.email + " not found");
        res.status(HttpStatus.UNAUTHORIZED).json(responseBuilder(false, HttpStatus.UNAUTHORIZED, [], "User " + user.email + " not found"));
      }

    } catch (err) {
      logger.error(err);
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting client orders " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    logger.error("No content in query params");
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT, [], "No content in query params"));
  }
})

let isFlightSearch = function (query) {
  return query.hasOwnProperty('origin') && query.hasOwnProperty('destination') && query.hasOwnProperty('date') && query.hasOwnProperty('passengers');
}

async function placeOrder(data, totalSeats, user, flightCombResult, finalPrice, seatsDetails) {

  let paymentResult = null;

  if (!_.isEmpty(data.credit)) {
    let cc = data.credit

    let cc_result = await placeCreditCardPayment(
      String(finalPrice),
      String(cc.number),
      String(cc.date.month),
      "20" + String(cc.date.year),
      String(cc.cvv),
      data.details.email,
      cc.name)

    if (!cc_result.success) {
      logger.error("Error placing payment, " + cc_result.message + " " + JSON.stringify(cc_result.result))
      return null;
    }

    paymentResult = await new Payment({
      paymentResult: JSON.stringify(cc_result)
    }).save()

  }

  let newOrder = new Order({
    flight: data.flight._id,
    orderedSeats: seatsDetails,
    details: data.details,
    price: finalPrice,
    customer: user ? user._id : null,
    payment_result: paymentResult ? paymentResult.id : null
  });
  let orderResult = await newOrder.save();
  // update flight
  let flightResult = await Flight.findByIdAndUpdate(flightCombResult.departure.id, {
    $push: {
      orders: newOrder
    },
    $inc: {
      orderedSeats: totalSeats
    }
  });
  logger.debug("Flight departure updated with order : " + JSON.stringify(flightResult, null, 2));
  if (flightCombResult.return) {
    flightResult = await Flight.findByIdAndUpdate(flightCombResult.return.id, {
      $push: {
        orders: newOrder
      },
      $inc: {
        orderedSeats: totalSeats
      }
    });
    logger.debug("Flight return updated with order : " + JSON.stringify(flightResult, null, 2));
  }
  return orderResult;
}

module.exports = router;
