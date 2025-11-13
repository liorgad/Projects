const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const config = require('./server/config/database')
const session = require('express-session');
const expressValidator = require('express-validator');
const helmet = require('helmet')
const app = express();

const morgan = require('morgan');
const logger = require('./server/lib/logger');


// API file for interacting with MongoDB
const api = require('./server/routes/api');
const eticket = require('./server/routes/eticketRoute');

require("./server/config/passport")(passport);

// logger middleware
app.use(morgan('combined', { stream: { write: function(msg, _encoding) {
  logger.info(msg);
}}}));

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var corsOptions = {
   exposedHeaders:['content-disposition','content-length',"last-modified", "content-type" , "cache-control"]
}

// CORS Middleware
app.use(cors(corsOptions));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/checkintravel')));

// app.use(session({
//     secret: config.secret ,
//     saveUninitialized: false,
//     resave: false
//   }))


app.use(passport.initialize());
app.use(passport.session());

// Express Validator
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root    = namespace.shift()
//         , formParam = root;
  
//       while(namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//         param : formParam,
//         msg   : msg,
//         value : value
//       };
//     }
//   }));
app.use(helmet())

// API location
app.use('/api', api);

// API location
app.use('/eticket', eticket);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/checkintravel/index.html'));
});

//Set Port
//const port = process.env.PORT || '3000';
const port = process.env.PORT || 8080;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));