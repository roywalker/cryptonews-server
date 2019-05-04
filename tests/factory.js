const db = require('../data/helpers');
const nanoid = require('nanoid/generate');
const { hashPassword } = require('../controllers/auth');

exports.generateUsername = () => {
  return nanoid('abcdefghijklmnopqrstuvwxyz', 20);
};

exports.addUser = async (username, password) => {
  await db.user.add({
    username,
    password: await hashPassword(password)
  });
};
