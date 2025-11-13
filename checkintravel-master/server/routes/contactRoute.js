const logger = require('../lib/logger');
const {
  Response,
  responseBuilder,
  errorResponse,
  CHECKIN_MAIL,
} = require('./common');
const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const {sendMailText} = require('../model/mail');

router.post('/', async (req, res) => {
  logger.debug('POST Request for contact')

  let data = req.body

  if (data) {
    try {
      if (!validate(data.email)) {        
        res.status(HttpStatus.METHOD_FAILURE).json(errorResponse("Not a valid email format"));
      }else{
        logger.debug("Sending mail : " + JSON.stringify(data, null, 2))

        let emailResult = await sendMailText(data.email,CHECKIN_MAIL,"Contact mail from checkin site","Hello my name is "+data.firstname+" " + data.lastname + " email: "+ data.email +" the message is : " +data.message)

        logger.debug("Contact mail result : " + JSON.stringify(emailResult,null,2))

        res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, [], "Message Sent"));
      }   
    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error sending message " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT, [], "No data"));
  }
})


const validate = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase())
}

module.exports = router;
