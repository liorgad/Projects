const express = require('express');
const router = express.Router();
const passport = require('passport');
const Location = require('../model/location');
const {
  Response,
  responseBuilder,
  errorResponse,toDate
} = require('./common');
const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');

router.get('/', async (req, res) => {

  try {
    let result = await Location.getLocations()

    logger.debug('result ' + JSON.stringify(result, null, 2));

    res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "Load Locations OK"));

  } catch (error) {
    logger.error('Error getting locations ' + error)

    res.status(HttpStatus.SERVICE_UNAVAILABLE).json(responseBuilder(false, HttpStatus.SERVICE_UNAVAILABLE, [], "GET request fail"));
  }
})

router.post('/', passport.authenticate('jwt', {
  session: false
}), async (req, res, next) => {

  logger.debug('received POST request to add location');
  logger.debug(JSON.stringify(req.body, null, 2));

  let loc = req.body;

  if (loc) {

    let newLocation = new Location({
      country: {
        hebrewName: loc.countryHeb,
        englishName: loc.countryEng,
      },
      airport: {
        hebrewName: loc.airportHeb,
        englishName: loc.airportEng
      },
      terminal: loc.terminal
    })

    if (newLocation) {

      try {
        const result = await newLocation.save()

        logger.debug('location added ' + JSON.stringify(result, null, 2));

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "save Locations OK"));
      } catch (error) {
        logger.error('Error adding location : ' + error);
        
        res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error adding location"));
      }

    }
  }

})

router.put('/:locationId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {

  logger.debug('Received PUT request')
  
  const id = req.params.locationId;
  const data = req.body;

  if (id && data) {

    try {
      logger.debug('PUT data : ' + JSON.stringify(data, null, 2))

      let updatedLoc = {
        country: {
          hebrewName: data.countryHeb,
          englishName: data.countryEng,
        },
        airport: {
          hebrewName: data.airportHeb,
          englishName: data.airportEng
        },
        terminal: data.terminal
      }

      let result = await Location.findByIdAndUpdate(id, updatedLoc)
      
      res.status(HttpStatus.OK).json(responseBuilder(true,HttpStatus.OK,result, 'location ' + id + ' updated successfully'));

    } catch (err) {
     
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error inserting location "+typeof err == 'object' ? err.message : err));
    }
  } else {

    logger.error("PUT request locationId Empty")
    
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("PUT request locationId Empty",HttpStatus.NO_CONTENT));
  }

})

router.delete('/:locationId', passport.authenticate('jwt', {
  session: false
}), async (req, res) => {
  
  const id = req.params.locationId;

  if (id) {

    try {
      let result = await Location.findByIdAndRemove(id)
     
      res.status(HttpStatus.OK).json(responseBuilder(true,HttpStatus.OK,result, 'location ' + id + ' successfully deleted'));

    } catch (err) {
      
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error deleting location "+typeof err == 'object' ? err.message : err));
    }


  } else {
    
    res.status(HttpStatus.NO_CONTENT).json(errorResponse("DELETE request with no id",HttpStatus.NO_CONTENT));
  }
})

module.exports = router;
