const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  getCommentById: id => {
    return db('comments').where({ id });
  },
  addComment: comment => {
    return db('comments')
      .insert(comment)
      .returning('id');
  },
  deleteComment: id => {
    return db('comments')
      .where({ id })
      .del();
  },
  getCommentsByAuthor: username => {
    return db('users')
      .join('comments', 'users.id', 'comments.authorId')
      .join('posts', 'comments.postId', 'posts.id')
      .select(
        'comments.id',
        'posts.localUrl as postUrl',
        'comments.comment',
        'comments.date'
      )
      .where({ username });
  }
};
