const mongoose = require('mongoose');

//Role Schema
const LocationSchema = mongoose.Schema({
    country : {
        hebrewName : String,
        englishName : String       
    },
    airport : {
        hebrewName : String,
        englishName : String
    },
    terminal : String
});

const Location = module.exports = mongoose.model('Location',LocationSchema,'locations');

module.exports.getLocations = function(callback){     
    //Location.find(callback);
    return Location.find()
}

module.exports.getCountries = function(callback){
    Location.find({}).select('country').exec(callback);    
}

module.exports.addLocation = function(newLocation,callback){
    newLocation.save(callback)
}