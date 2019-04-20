const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  verifyUpvote: upvote => {
    return db('upvotes').where({ ...upvote });
  },
  addUpvote: upvote => {
    return db('upvotes').insert(upvote);
  },
  removeUpvote: upvote => {
    return db('upvotes')
      .where({ ...upvote })
      .del();
  }
};
