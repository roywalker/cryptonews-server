const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  getCommentsByAuthor: authorUsername => {
    return db('users')
      .join('comments', 'users.id', 'comments.authorId')
      .select(
        'comments.id',
        'comments.postId as post_url',
        'comments.comment',
        'comments.date'
      )
      .where({ username: authorUsername });
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
  }
};
