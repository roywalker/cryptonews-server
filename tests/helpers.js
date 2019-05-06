const config = require('../config');
const db = require('../data/helpers');
const nanoid = require('nanoid/generate');
const { hashPassword } = require('../controllers/auth');
const jwt = require('jsonwebtoken');
const { generateSlug } = require('../controllers/posts');

exports.newUsername = () => {
  return nanoid('abcdefghijklmnopqrstuvwxyz', 20);
};

exports.createUser = async () => {
  const username = this.newUsername();
  const password = 'v4lidPassword';
  const [id] = await db.user.add({
    username,
    password: await hashPassword(password)
  });
  return { id, username, password };
};

exports.verifyJWT = (token, username) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded.user.username === username;
  } catch (err) {
    return false;
  }
};

exports.createPost = async (title, url, authorId) => {
  return await db.posts.add({
    title,
    url,
    authorId,
    localUrl: generateSlug(title)
  });
};

exports.restartDb = async () => {
  await db.all.migrate();
  await db.all.empty();
};

exports.sendVote = db.votes.vote;

exports.createComment = async (authorId, postId, comment) => {
  return await db.comments.add({ authorId, postId, comment });
};
