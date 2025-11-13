const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');
const {
  responseBuilder,
  errorResponse,
} = require('./common');
const Order = require('../model/order');
const {
  ObjectID
} = require('mongodb');
const _ = require('lodash');
const {
    builderEticketHtml    
  } = require('../lib/eticketBuiler')




router.get('/:id', async (req, res) => {
  logger.debug('Received GET request')

  let queryParams = req.params;

  logger.debug("Eticket query params : " + JSON.stringify(queryParams, null, 2))

  const prodUrl = String("checkintravel.co.il")
  const devUrl = String("localhost") 

  if (queryParams && (!_.isEmpty(queryParams.id)) && (String(req.hostname).includes(devUrl) || String(req.hostname.includes(prodUrl)))){

    let id = queryParams.id

    if (!ObjectID.isValid(id)) {
      logger.error("Id not valid, " + id)
      res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.BAD_REQUEST, [], 'Bad id format'));
      return
    }

    try {
      let orderResult = await Order.findById(id); 
      
      let departure = {
        id: orderResult.flight.departure.flightId.airline + " " + String(orderResult.flight.departure.flightId.number),
        airline: orderResult.flight.departure.airlineName.name,
        dt: orderResult.flight.departure.departure,
        origin: orderResult.flight.departure.origin,
        arrival: orderResult.flight.departure.arrival,
        destination: orderResult.flight.departure.destination
      }

      let returnFlight = {
        id: orderResult.flight.return.flightId.airline + " " + String(orderResult.flight.return.flightId.number),
        airline: orderResult.flight.return.airlineName.name,
        dt: orderResult.flight.return.departure,
        origin: orderResult.flight.return.origin,
        arrival: orderResult.flight.return.arrival,
        destination: orderResult.flight.return.destination
      }

      let eticketHtml = builderEticketHtml(orderResult.orderId, !_.isEmpty(orderResult), new Date(orderResult.order_dt), orderResult.details.passengers, departure, returnFlight)
      
      if(!_.isNil(eticketHtml)){
        res.status(HttpStatus.OK).send(eticketHtml)
        return
      }
      
      res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.NO_CONTENT,[],"Order Not Found !")) 

    } catch (error) {
      logger.error("Error getting orders : " + JSON.stringify(error, null, 2))
      res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR,[],err))
    }

    return
  }

  res.status(HttpStatus.BAD_REQUEST).json(responseBuilder(false, HttpStatus.BAD_REQUEST, [], 'Bad id format'));
})



module.exports = router;
