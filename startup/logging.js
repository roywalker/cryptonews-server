const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;
require('express-async-errors');

module.exports = function() {
  winston.add(
    new winston.transports.Console({
      handleExceptions: true,
      format: combine(timestamp(), prettyPrint())
    })
  );
  winston.add(
    new winston.transports.File({
      filename: './errors/exceptions.log',
      handleExceptions: true,
      format: combine(timestamp(), prettyPrint())
    })
  );
};
