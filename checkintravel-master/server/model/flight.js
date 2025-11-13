const mongoose = require('mongoose');

//Flight Schema
const FlightSchema = mongoose.Schema({    
    flightId : {
        airline : String,
        number : Number
    },    
    airlineName : {type: mongoose.Schema.Types.ObjectId,ref : 'Airline',autopopulate:true },
    departure : Date,
    arrival : Date,
    costPrice : Number,
    salePrice : Number,
    price : Number,
    isOnSale : Boolean,
    seats : Number,    
    origin : {type: mongoose.Schema.Types.ObjectId,ref : 'Location',autopopulate:true },
    destination : {type: mongoose.Schema.Types.ObjectId,ref : 'Location',autopopulate:true },    
    orderedSeats : {type:Number,default : 0},
    create_dt : Date,  
    orders : [{type: mongoose.Schema.Types.ObjectId,ref : 'Order'}]  
});
FlightSchema.plugin(require('mongoose-autopopulate'));


const Flight = module.exports = mongoose.model('Flight',FlightSchema,'flights');

toCustomerDisplay = function(flight){
    //let f = flight.omit(['costPrice','salePrice','isOnSale','seats']);
    let f = flight.omit(['costPrice','salePrice','seats']);
    f.price = flight.isOnSale ? flight.salePrice : price ;
    return f;
}
