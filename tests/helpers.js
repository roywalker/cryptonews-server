const config = require('../config');
const db = require('../data/helpers');
const nanoid = require('nanoid/generate');
const { hashPassword } = require('../controllers/auth');
const { generateSlug } = require('../controllers/posts');
const jwt = require('jsonwebtoken');

exports.create = {
  user: async () => {
    const username = this.create.username();
    const password = 'v4lidPassword';
    const [id] = await db.user.add({
      username,
      password: await hashPassword(password)
    });
    return { id, username, password };
  },
  post: async (title, url, authorId) => {
    return await db.posts.add({
      title,
      url,
      authorId,
      localUrl: generateSlug(title)
    });
  },
  comment: async (authorId, postId, comment) => {
    return await db.comments.add({ authorId, postId, comment });
  },
  username: () => {
    return nanoid('abcdefghijklmnopqrstuvwxyz', 20);
  }
};

exports.verifyJWT = (token, username) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded.user.username === username;
  } catch (err) {
    return false;
  }
};

exports.cleanDb = async () => {
  await db.all.migrate();
  await db.all.empty();
};

exports.vote = db.votes.vote;
