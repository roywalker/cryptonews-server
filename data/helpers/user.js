const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  addUser: user => {
    return db('users')
      .insert(user)
      .returning('id');
  },
  getUserById: id => {
    return db('users').where({ id });
  },
  getUserByUsername: username => {
    return db('users').where({ username });
  }
};
