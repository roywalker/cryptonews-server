const knex = require('knex');
const config = require('./knexfile');
const db = knex(config.db);

exports.user = {
  add: user => {
    return db('users')
      .insert(user)
      .returning('id');
  },
  getById: id => {
    return db('users')
      .where({ id })
      .first();
  },
  getByUsername: username => {
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
  get: () => {
    return db('posts')
      .select(
        'posts.id',
        'posts.title',
        'posts.url',
        'posts.date',
        'users.username as author',
        'posts.localUrl',
        db.raw(`
          (SELECT COUNT(*) as upvotes FROM upvotes WHERE posts.id = upvotes."postId"),
          (SELECT COUNT(*) as comments FROM comments WHERE posts.id = comments."postId")`)
      )
      .join('users', { 'posts.authorId': 'users.id' });
  },
  getById: id => {
    return db('posts')
      .select(
        'posts.id',
        'posts.title',
        'posts.url',
        'posts.date',
        'users.username as author',
        'posts.localUrl',
        db.raw(
          '(SELECT COUNT(*) as upvotes FROM upvotes WHERE posts.id = upvotes."postId")'
        )
      )
      .join('users', { 'posts.authorId': 'users.id' })
      .where({ 'posts.id': id })
      .first();
  },
  delete: id => {
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
  getById: id => {
    return db('comments')
      .where({ id })
      .first();
  },
  getByPost: postId => {
    return db('comments')
      .select(
        db.raw(
          'comments.id, comments.comment, users.username as author, comments.date, (SELECT COUNT(*) as upvotes FROM upvotes WHERE upvotes."commentId" = comments.id)'
        )
      )
      .join('users', { 'comments.authorId': 'users.id' })
      .where({ postId });
  },
  deleteComment: id => {
    return db('comments')
      .where({ id })
      .del();
  }
};

exports.votes = {
  vote: async (authorId, postId = null, commentId = null) => {
    const vote = { authorId, postId, commentId };
    const exists = await exports.votes.verify(vote);
    if (!exists) await exports.votes.add(vote);
    else await exports.votes.remove(vote);
    return await exports.votes.getByContent(postId, commentId);
  },
  verify: vote => {
    return db('upvotes')
      .where({ ...vote })
      .first();
  },
  add: vote => {
    return db('upvotes').insert(vote);
  },
  remove: vote => {
    return db('upvotes')
      .where({ ...vote })
      .del();
  },
  getByContent: (postId, commentId) => {
    return db('upvotes')
      .where({ postId, commentId })
      .count('*')
      .first();
  }
};
