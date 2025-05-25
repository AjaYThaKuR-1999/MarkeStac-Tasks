const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf, colorize } = format;

// Format for console logs
const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), consoleFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat)
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Logs each incoming request
const requestLogger = (req, res, next) => {
  const { method, originalUrl } = req;
  logger.info(`API Hit → ${method} ${originalUrl}`);
  next();
};

// Logs detailed error info when any error occurs
const errorLogger = (err, req, res, next) => {
  logger.error(`API Error → ${req.method} ${req.originalUrl} | ${err.message}`);
  logger.error(err.stack);
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
};
