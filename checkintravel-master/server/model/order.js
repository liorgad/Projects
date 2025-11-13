const mongoose = require('mongoose');
const counter = require('./counters');
const OrderID = require('./orderId');
const _ = require('lodash');

var PersonSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  gender: {type:String, default:'M'},
  isInfant:  mongoose.SchemaTypes.Boolean
});
//Order Schema
const OrderSchema = mongoose.Schema({
  flight: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'FlightCombination',
    autopopulate : true
  },
  orderedSeats: {
    adults: {
      type: Number,
      default: 0
    },
    infants: {
      type: Number,
      default: 0
    },
  },
  details: {
    email: String,
    country: String,
    isConfirmed: mongoose.SchemaTypes.Boolean,
    phone: String,
    passengers: [PersonSchema]
  },
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    autopopulate : true
  },
  order_dt: Date,
  orderId: String,
  // {
  //   type: Number,
  //   default: 0
  // },
  seats: {
    type: Number,
    default: 0
  },
  price : {type : Number, default :0},
  payment_result : {type : mongoose.SchemaTypes.ObjectId,ref: 'Payment',autopopulate:false}
});

OrderSchema.plugin(require('mongoose-autopopulate'));

const NEXT_LETTERMAP = {
  "A" : "B",
  "B" : "C",
  "C" : "D",
  "D" : "E",
  "E" : "F",
  "F" : "G",
  "G" : "H",
  "H" : "I",
  "I" : "J",
  "J" : "K",
  "K" : "L",
  "L" : "M",
  "M" : "N",
  "N" : "O",
  "O" : "P",
  "P" : "Q",
  "Q" : "R",
  "R" : "S",
  "S" : "T",
  "T" : "U",
  "U" : "V",
  "V" : "W",
  "W" : "X",
  "X" : "Y",
  "Y" : "Z",
  "Z" : "A",  
 }

OrderSchema.pre('save',async function (next) {
  var doc = this;
  doc.order_dt = Date.now();

  try {
    let nextOrderId = await OrderID.findById('ordersId');

    if(!_.isNil(nextOrderId)){
      if(nextOrderId.num >= 9999999){
        nextOrderId = await OrderID.findByIdAndUpdate({_id: 'ordersId'}, {  
          char : NEXT_LETTERMAP[nextOrderId.char], num : 1000000 })
      }else{
        nextOrderId = await OrderID.findByIdAndUpdate({
          _id: 'ordersId'
        }, {
          $inc: {            
              num : 1            
          }
        });        
      }
      doc.orderId = nextOrderId.char+String(nextOrderId.num);
      next();
    }

  } catch (e) {
    return next(e);
  }})
  
//   counter.findByIdAndUpdate({
//     _id: 'ordersId'
//   }, {
//     $inc: {
//       seq: 1
//     }
//   }, function (error, counter) {
//     if (error)
//       return next(error);
//     doc.orderId = counter.seq;
//     next();
//   });
// });

const Order = module.exports = mongoose.model('Order', OrderSchema, 'orders');
