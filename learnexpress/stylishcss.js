var express = require('express')
var stylus = require('stylus')
var app = express()


app.use(stylus.middleware(process.argv[3] || __dirname + '/public'));
app.use(express.static(process.argv[3]||path.join(__dirname, 'public')));


app.listen(process.argv[2])