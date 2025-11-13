const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');
const HttpStatus = require('http-status-codes');
const {  
  responseBuilder,
  errorResponse,  
} = require('./common');
const Log = require('../model/log');

router.post('/', async (req, res, next) => {

  let log = req.body;

  if (log) {
     try {
      const result = await new Log({log:log}).save()   

       res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, [], ""));
     } 
     catch (error) {
       logger.error('Error adding log : ' + error);

       res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error adding log"));
     }
  }
  else{    
    res.status(HttpStatus.NO_CONTENT).json({success: false,status: HttpStatus.OK,data:[],message: "missing log details"});
  }

})

module.exports = router;