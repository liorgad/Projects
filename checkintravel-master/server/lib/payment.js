const config = require('../config/database');
const axios = require('axios');
const logger = require('../lib/logger');
const _ = require('lodash');

Object.fromEntries = arr =>
  Object.assign({}, ...Array.from(arr, ([k, v]) => ({
    [k]: v
  })));

const cc_test = {

  CardNumber: "4580000000000000",

  Month: "03",

  Year: "2020",

  TZ: "",

  CVV: "333"
}

const doDealPostBody = {

  "ClientIDPass": {

    "ClientID": config.easyCard.ClientID,

    "Password": config.easyCard.Password

  },

  "TotalSum": "1000",

  "FirstPay": "",

  "AddPay": "",

  "PayNumber": "",

  "OwnerName": "",

  "MType": 2,

  "Opt": "51",

  "Note": "",

  "ExternalID": "",

  "Token": "",

  "DealType": 1,

  "cardDetails": {

    "CardNumber": "4580000000000000",

    "Month": "03",

    "Year": "2020",

    "TZ": "",

    "CVV": ""

  },

  "ActionMethod": "50",

  "AuthNum": "",

  "Cell": "",

  "UserCode": "",

  "CreateToken": "",

  "Email": "",

  "JsonProductsList": "",

  "CostumerAddress": "",

  "CostumerPostalCode": "",

  "CostumerEmail": "",

  "CostumerPhomeNumber": "",

  "EcPwd": "",

  "typeDoDeal": 1
}

const placeCreditCardPayment = async (sum, cardNumber, month, year, cvv, customerMail, customerName) => {

  if (_.isNil(sum) || _.isNil(cardNumber) || _.isNil(month) || _.isNil(year) || _.isNil(cvv) || _.isNil(customerMail) || _.isNil(customerName) ||
  !_.isString(sum) ||!_.isString(cardNumber) ||!_.isString(month) ||!_.isString(year) ||!_.isString(cvv) ||!_.isString(customerMail) ||!_.isString(customerName) ) {
    logger.error("Error in placeCreditCardPayment parameters on of the input params is null or undefined")
    return {success : false,message: "Error in placeCreditCardPayment parameters on of the input params is null or undefined",result:null};
  }

  doDealPostBody.cardDetails.CardNumber = cardNumber
  doDealPostBody.cardDetails.Month = month
  doDealPostBody.cardDetails.Year = year
  doDealPostBody.cardDetails.CVV = cvv

  doDealPostBody.CostumerEmail = customerMail
  doDealPostBody.Email = customerMail
  doDealPostBody.OwnerName = customerName
  doDealPostBody.TotalSum = sum

  try {
    let response = await axios.post(config.easyCard.paymentPostUrl, doDealPostBody)   

    if (response.status == 200) {
      let data = String(response.data)
      let arr = []

      _.trimStart(data, '"').split("&").forEach(e => arr.push(e.split("=")))

      let result = Object.fromEntries(arr);

      return {success : result.Code === "000",message: result.ErrorDesc, result:result}

    } else {        
      logger.error("Error in post request for payment, " + response.data)

      return {success : false,message: "Error making post for payment",result:result}
    }

  } catch (err) {
    logger.error("Error making post for payment , " + err)
  }

  return {success : false,message: "Error making post for payment",result:null}
}




async function call(){
var res = await placeCreditCardPayment("1000", "4580000000000000", "03", "2020", "455","liorgad@gmail.com","lior gad")
console.log(JSON.stringify(res))
}

//call()

module.exports = {
  placeCreditCardPayment
}
