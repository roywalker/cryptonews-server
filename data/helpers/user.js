const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  addUser: user => {
    return db('users')
      .insert(user)
      .returning('id');
  },
  getUser: id => {
    return dbW('users').where({ id });
  }
};
