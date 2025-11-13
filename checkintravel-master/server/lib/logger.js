const winston = require('winston');

const level = process.env.LOG_LEVEL || 'debug';

const {transports, createLogger, format} = require('winston');

    // const logger = createLogger({
    //     level : level,
    //     format: format.combine(
    //         format.timestamp()            
    //     ),
    //     transports: [
    //         new transports.Console(),
    //         new transports.File({filename: 'logs/error/error.log', level: 'error'}),
    //         new transports.File({filename: 'logs/activity/activity.log', level:'info'})
    //     ]
    // });

// winston.configure({    
//     format: winston.format.simple(),
//     transports: [
//         new winston.transports.File({ filename: 'log/app.log' }),        
//     ]
// });


// if (process.env['NODE_ENV'] !== 'production') {
//     winston.add(new winston.transports.Console());
// }

const logger = winston.createLogger({
    level: level,    
    format: winston.format.simple(),
    // format : format.combine(
    //     format.timestamp()  
    // ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        //new winston.transports.Console(),
        new winston.transports.File({ filename: 'log/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'log/app.log',level :level}),        
    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: level,
        timestamp: function () {
            return (new Date()).toISOString();
        }
    }));
}

module.exports = logger;