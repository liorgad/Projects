'use strict';
const HttpStatus = require('http-status-codes');

// class Response {
//     constructor(success = false,status=HttpStatus.NO_CONTENT,data = [],message= null) {
//       this.success = success;
//       this.status = status;
//       this.data = data;
//       this.message = message;
//     }
//   }

// Error handling
var sendError = (err, res) => {
  response.success = false;
  response.status = HttpStatus.SERVICE_UNAVAILABLE;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(HttpStatus.SERVICE_UNAVAILABLE).json(response);
};

var responseBuilder = (success = false, status = HttpStatus.NO_CONTENT, data = [], message = null) => {
  return new Response(success, status, data, message).json()
}

var toDate = (day, time) => {
  if (day && time) {
    return new Date(day.year, day.month - 1, day.day, time.hour, time.minute);
  }
  return null;
};

var errorResponse = (message = 'Error', status = HttpStatus.OK, data = []) => {
  return new Response(false, status, data, message).json()
}

// Response handling
// module.exports = response = {
//     success : true,
//     status: HttpStatus.OK,
//     data: [],
//     message: null    
// };

var Response = class Response {
  constructor(success = false, status = HttpStatus.NO_CONTENT, data = [], message = null) {
    this.success = success;
    this.status = status;
    this.data = data;
    this.message = message;
  }

  json(){
    return {success:this.success,status:this.status,data:this.data,message:this.message}
  }
}

const validateEmail = (email) => {
  const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(email).toLowerCase())
}

const INFANT_PRICE = 75
const CHECKIN_MAIL = "checkintravel.flying@gmail.com"

module.exports = {
  Response,
  toDate,
  responseBuilder,
  sendError,
  errorResponse,
  INFANT_PRICE,
  validateEmail,
  CHECKIN_MAIL
}
