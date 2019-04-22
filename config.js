require('dotenv').config();

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
    secret: process.env.JWT_SECRET || 'shhhhhh'
  }
};
