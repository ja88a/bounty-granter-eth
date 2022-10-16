const winston = require('winston');
const { format } = require('logform');

// const timeFormat = format.combine(
//     format.timestamp(),
//     format.printf((info: { timestamp: number; class: string; level: number; message: any; }) => `${info.timestamp} ${info.level} ${info.class}: ${info.message}`)
//   );

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    const alignedWithColorsAndTime = format.combine(
        format.colorize(),
        format.timestamp(),
//        format.align(),
        format.printf((info: { timestamp: number; class: string; level: number; message: any; }) => `${info.timestamp} ${info.level} ${info.class}: ${info.message}`)
      );

    logger.add(new winston.transports.Console({
        level: 'debug',
        format: alignedWithColorsAndTime, //winston.format.simple(),
    }));
}

export default logger;