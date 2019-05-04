const config = require('../config');
const db = require('../data/helpers');
const nanoid = require('nanoid/generate');
const { hashPassword } = require('../controllers/auth');
const { verifyJWT } = require('../controllers/auth');

exports.generateUsername = () => {
  return nanoid('abcdefghijklmnopqrstuvwxyz', 20);
};

exports.createUser = async (username, password) => {
  await db.user.add({
    username,
    password: await hashPassword(password)
  });
};

exports.validateToken = (token, username) => {
  const decoded = verifyJWT(token, config.jwt.secret);
  return decoded.user.username === username;
};
