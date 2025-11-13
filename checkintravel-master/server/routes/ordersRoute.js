const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../model/order');
const Flight = require('../model/flight');
const {
  Response,
  responseBuilder,
  errorResponse,
  toDate
} = require('./common');

const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');

router.get('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('Received GET request')

  try {
    let result = await Order.find()
      .populate({
        path: 'departure',
        select: 'departure arrival flightId price seats'
      })
      .populate({
        path: 'return',
        select: 'departure arrival flightId price seats'
      })
      .populate({
        path: 'customer',
        select: 'email manager phone'
      });

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'OK'));

  } catch (error) {
    logger.error("Error getting orders : " + JSON.stringify(error, null, 2))
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR))
  }
})

router.post('/', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('Received POST request')

  const data = req.body;

  if (data) {
    try {

      let flight = await Flight.findById(data.departure)
      if (flight.seats >= data.seats) {
        let newOrder = new Order({
          direction: data.direction,
          departure: data.departure,
          return: data.direction === "one way" ? null : data.return,
          customer: data.customer,
          seats: data.seats
        });

        let result = await newOrder.save()

        result = await Flight.findByIdAndUpdate(data.departure, {
          $push: {
            orders: newOrder
          },
          $inc: {
            orderedSeats: data.seats
          }          
        })

        logger.debug("Flight departure updated with order : " + JSON.stringify(result, null, 2))

        if (data.direction !== "one way") {
          result = await Flight.findByIdAndUpdate(data.return, {
            $push: {
              orders: newOrder
            },
            $inc: {
              orderedSeats: data.seats
            }                        
          })

          logger.debug("Flight return updated with order : " + JSON.stringify(result, null, 2))
        }

        result.forEach(fc => 
          {
            fc = _.omit(fc,['costPrice', 'isOnSale', 'salePrice','orders','orderedSeats'])            
          })      
  

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'OK'));
      } else {
        logger.warning("'Not enough seats available'")
        res.status(HttpStatus.METHOD_NOT_ALLOWED).json(responseBuilder(false, HttpStatus.METHOD_NOT_ALLOWED, result, 'Not enough seats available'));
      }

    } catch (error) {
      logger.error("Error getting orders : " + JSON.stringify(error, null, 2))
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR))
    }
  } else {
    logger.error("Error no parameters ")
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT))
  }
})

router.put('/:id', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  logger.debug('Received PUT request')

  const id = req.params.id;
  const data = req.body;

  if (id && data) {
    try {
      let result = await Order.findByIdAndUpdate(id, {
        direction: data.direction,
        departure: data.departure,
        return: data.direction === "two way" ? data.return : null,
        customer: data.customer,
        seats: data.seats
      })


      logger.debug("Update OK : " + JSON.stringify(result, null, 2))
      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'Update OK'));

    } catch (error) {
      logger.error("Error getting orders : " + JSON.stringify(error, null, 2))
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR))
    }
  } else {
    logger.error("Error no parameters ")
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT))
  }

})

router.delete('/:id', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  logger.debug('Received DELETE request')

  const id = req.params.id;

  if (id) {
    try {
      let result = await Order.findByIdAndDelete(id)

      logger.debug("Delete OK : " + JSON.stringify(result, null, 2))
      res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, 'OK'));

    } catch (error) {
      logger.error("Error getting orders : " + JSON.stringify(error, null, 2))
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBuilder(false, HttpStatus.INTERNAL_SERVER_ERROR))
    }
  } else {
    logger.error("Error no parameters ")
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT))
  }

})


module.exports = router;
