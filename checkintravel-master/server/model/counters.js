const mongoose = require('mongoose');

var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

module.exports = counter = mongoose.model('counter', CounterSchema);
