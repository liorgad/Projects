const mongoose = require('mongoose');

var LogSchema = mongoose.Schema({   
    log:  String,    
    create_dt : Date,
});

LogSchema.pre('save', function (next) {   
    var doc = this;
    doc.create_dt = Date.now(); 
    next()    
});

module.exports = Log = mongoose.model('log', LogSchema,'logs');