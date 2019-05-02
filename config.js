require('dotenv').config();
const winston = require('winston');

module.exports = {
  port: process.env.PORT || 3001,
  db: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/cryptonews',
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },
    useNullAsDefault: true
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'shhhhhh',
    expires: process.env.JWT_EXPIRES || '7d'
  },
  logger: winston
};

winston.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp()
    )
  })
);
