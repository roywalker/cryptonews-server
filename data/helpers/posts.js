const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  getPosts: () => {
    return db('posts');
    //.offset(skip)
    //.limit(pageSize);
  },
  getPostById: id => {
    return db('posts').where({ id });
  },
  getPostByUrlSlug: localUrlSlug => {
    return db('posts').where({ localUrlSlug });
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
