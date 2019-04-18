const winston = require('winston');
require('express-async-errors');

module.exports = function() {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({
        filename: '../errors/error.log',
        level: 'error'
      }),
      new winston.transports.File({ filename: '../errors/combined.log' })
    ]
  });

  winston.exceptions.handle(
    new winston.transports.File({ filename: '../errors/exceptions.log' })
  );

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({ format: winston.format.simple() })
    );

    winston.exceptions.handle(
      new winston.transports.Console({ format: winston.format.simple() })
    );
  }
};
