const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  getPosts: () => {
    return db('posts');
  },
  getPost: id => {
    return db('posts').where({ id });
  },
  getPostComments: postId => {
    return db('comments').where({ postId });
  },
  addPost: post => {
    return db('posts')
      .insert(post)
      .returning('id');
  },
  deletePost: id => {
    return db('posts')
      .where({ id })
      .del();
  }
};