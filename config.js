require('dotenv').config();
const winston = require('winston');

module.exports = {
  db: {
    env: {
      client: 'pg',
      connection: process.env.DATABASE_URL || 'postgres://localhost/cryptonews',
      migrations: {
        directory: './migrations'
      },
      seeds: {
        directory: './seeds'
      },
      useNullAsDefault: true
    },
    test: {
      client: 'pg',
      connection:
        process.env.DATABASE_TEST_URL || 'postgres://localhost/cryptonews_test',
      useNullAsDefault: true
    }
  },
  port: process.env.PORT || 3001,
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
