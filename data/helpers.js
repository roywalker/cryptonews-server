const knex = require('knex');
const config = require('../config');
const db = knex(config.db.env);

exports.user = {
  add: user => {
    return db('users')
      .insert(user)
      .returning('id');
  },
  findById: id => {
    return db('users')
      .where({ id })
      .first();
  },
  findByUsername: username => {
    return db('users')
      .where({ username })
      .first();
  }
};

exports.posts = {
  add: async post => {
    const [id] = await db('posts')
      .insert(post)
      .returning('id');
    return db('posts').where({ id });
  },
  list: () => {
    return db('posts')
      .select(
        'posts.localUrl as slug',
        'posts.id',
        'posts.title',
        'posts.url',
        'posts.date',
        'users.username as author',
        db.raw(`
          (SELECT COUNT(*) as votes FROM votes WHERE posts.id = votes."postId"),
          (SELECT COUNT(*) as comments FROM comments WHERE posts.id = comments."postId")`)
      )
      .join('users', { 'posts.authorId': 'users.id' });
  },
  find: slug => {
    return db('posts')
      .select(
        'posts.localUrl as slug',
        'posts.id',
        'posts.title',
        'posts.url',
        'posts.date',
        'users.username as author',
        db.raw(
          '(SELECT COUNT(*) as votes FROM votes WHERE posts.id = votes."postId")'
        )
      )
      .join('users', { 'posts.authorId': 'users.id' })
      .where({ 'posts.localUrl': slug })
      .first();
  },
  delete: async id => {
    await exports.comments.deleteCommentsByPost(id);
    return db('posts')
      .where({ id })
      .del();
  }
};

exports.comments = {
  add: async comment => {
    const [id] = await db('comments')
      .insert(comment)
      .returning('id');
    return db('comments')
      .where({ id })
      .first();
  },
  findById: id => {
    return db('comments')
      .where({ id })
      .first();
  },
  findByPost: postId => {
    return db('comments')
      .select(
        db.raw(
          'comments.id, comments.comment, users.username as author, comments.date, (SELECT COUNT(*) as votes FROM votes WHERE votes."commentId" = comments.id)'
        )
      )
      .join('users', { 'comments.authorId': 'users.id' })
      .where({ postId });
  },
  deleteComment: id => {
    return db('comments')
      .where({ id })
      .del();
  },
  deleteCommentsByPost: postId => {
    return db('comments')
      .where({ postId })
      .del();
  }
};

exports.votes = {
  vote: async (authorId, postId = null, commentId = null) => {
    const vote = { authorId, postId, commentId };
    const exists = await exports.votes.verify(vote);
    if (!exists) await exports.votes.add(vote);
    else await exports.votes.remove(vote);
    return await exports.votes.findByContent(postId, commentId);
  },
  verify: vote => {
    return db('votes')
      .where({ ...vote })
      .first();
  },
  add: vote => {
    return db('votes').insert(vote);
  },
  remove: vote => {
    return db('votes')
      .where({ ...vote })
      .del();
  },
  findByContent: (postId, commentId) => {
    return db('votes')
      .where({ postId, commentId })
      .count('*')
      .first();
  }
};

exports.all = {
  migrate: async () => {
    return await db.migrate.latest();
  },
  empty: async () => {
    return await db.raw('TRUNCATE TABLE users, posts, comments, votes CASCADE');
  }
};
