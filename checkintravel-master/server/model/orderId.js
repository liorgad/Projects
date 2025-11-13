const mongoose = require('mongoose');

var OrderIDSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  char: {
    type: String,
    default: "A"
  },
  num: {
    type: Number,
    default: 1000000
  }

});

module.exports = OrderID = mongoose.model('orderID', OrderIDSchema,'orderID');
