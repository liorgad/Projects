const mongoose = require('mongoose');

var AirlineSchema = mongoose.Schema({   
    name:  String,
    img: { data: Buffer, contentType: String },
    create_dt : Date,
});

module.exports = Airline = mongoose.model('Airline', AirlineSchema);