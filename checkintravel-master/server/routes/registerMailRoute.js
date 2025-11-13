const logger = require('../lib/logger');
const {
  Response,
  responseBuilder,
  errorResponse,
} = require('./common');
const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const Email = require('../model/mail');

router.get('/', async (req, res) => {
  logger.debug('GET Request for flights')

  let query = req.query

  if (query) {
    try {
      if (validate(query.email)) {
        let mail = await Email.find({
          email: query.email
        })

        if (mail && !_.isEmpty(mail)) {
          res.status(HttpStatus.METHOD_FAILURE).json(responseBuilder(false, HttpStatus.METHOD_FAILURE, [], "mail already exists"));
        } else {
          let newEmail = new Email({
            email: query.email
          })

          let result = await newEmail.save()

          logger.debug("Register mail : " + JSON.stringify(result, null, 2))

          res.status(HttpStatus.OK).json(responseBuilder(true, HttpStatus.OK, result, "OK"));
        }
      } else {
        res.status(HttpStatus.METHOD_FAILURE).json(errorResponse("Not a valid email format"));
      }

    } catch (err) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json(errorResponse("Error getting flights " + (typeof err == 'object' ? err.message : err)));
    }
  } else {
    res.status(HttpStatus.NO_CONTENT).json(responseBuilder(false, HttpStatus.NO_CONTENT, [], "No email provided"));
  }
})


const validate = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase())
}

module.exports = router;
