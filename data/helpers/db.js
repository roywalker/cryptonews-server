const knex = require('knex');
const knexConfig = require('../../knexfile');
const db = knex(knexConfig);

module.exports = {
  dbuser: {
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
  },
  dbposts: {
    getPosts: () => {
      return db('posts');
    },
    getPostById: id => {
      return db('posts').where({ id });
    },
    getPostByUrlSlug: localUrl => {
      return db('posts').where({ localUrl });
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
  },
  dbcomments: {
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
  },
  dbupvotes: {
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
  }
};
