const mongoose = require('mongoose');

var PaymentSchema = mongoose.Schema({   
    paymentResult:  String,    
    create_dt : Date,
});

PaymentSchema.pre('save', function (next) {   
    var doc = this;
    doc.create_dt = Date.now(); 
    next()    
});

module.exports = Payment = mongoose.model('payment', PaymentSchema,'payments');
