const knex = require('knex');
const config = require('../config');
const db = knex(config.db);

exports.dbuser = {
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

exports.dbposts = {
  getPosts: () => {
    return db('posts')
      .select(
        db.raw(
          'posts.*, users.username as author, (SELECT COUNT(*) as upvotes FROM upvotes WHERE posts.id = upvotes."postId")'
        )
      )
      .join('users', { 'posts.authorId': 'users.id' });
  },
  getPostById: id => {
    return db('posts').where({ id });
  },
  getPostByUrlSlug: localUrl => {
    return db('posts')
      .select(
        db.raw(
          'posts.*, users.username as author, (SELECT COUNT(*) as upvotes FROM upvotes WHERE posts.id = upvotes."postId")'
        )
      )
      .join('users', { 'posts.authorId': 'users.id' })
      .where({ localUrl });
  },
  getPostComments: postId => {
    return db('comments')
      .select(
        db.raw(
          'comments.id, comments.comment, users.username as author, comments.date, (SELECT COUNT(*) as upvotes FROM upvotes WHERE upvotes."commentId" = comments.id)'
        )
      )
      .join('users', { 'comments.authorId': 'users.id' })
      .where({ postId });
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
exports.dbcomments = {
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

exports.dbupvotes = {
  getUpvotesById: postId => {
    return db('upvotes')
      .where({ postId })
      .count('*');
  },
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
