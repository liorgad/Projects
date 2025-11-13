const mongoose = require('mongoose');
const counter = require('./counters');

const FlightCombinationSchema = mongoose.Schema({
    id : Number,
    departure : {type: mongoose.Schema.Types.ObjectId,ref : 'Flight',autopopulate:true },
    return :{type: mongoose.Schema.Types.ObjectId,ref : 'Flight' ,autopopulate : true},
    costPrice : Number,
    salePrice : Number,
    price : Number,
    isOnSale : Boolean,
    totalPrice : Number,
    availableSeats :{
        departure : {type: Number, default : 0},
        return : {type: Number, default : 0}
    },
    create_dt : Date,
});

FlightCombinationSchema.plugin(require('mongoose-autopopulate'));

FlightCombinationSchema.pre('save', function (next) {   
    var doc = this;
    doc.create_dt = Date.now();   
    
    counter.findByIdAndUpdate({_id: 'ordersId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.id = counter.seq;
        next();
    });
});

const FlightCombination = module.exports = mongoose.model('FlightCombination',FlightCombinationSchema,'flightCombinations');
