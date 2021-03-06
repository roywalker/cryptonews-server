const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

exports.checkPassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

exports.createJWT = (id, username) => {
  return jwt.sign({ user: { id, username } }, config.jwt.secret, {
    expiresIn: config.jwt.expires
  });
};

exports.verifyJWT = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return false;
  }
};

exports.tokenAuth = (req, res, next) => {
  if (!req.headers.token)
    return res.status(401).json({ error: 'Access denied (no token found).' });

  const decoded = this.verifyJWT(req.headers.token);
  if (!decoded)
    return res.status(401).json({ error: 'Access denied (invalid token).' });

  req.user = decoded.user;
  next();
};

exports.postAuth = (req, res, next) => {
  if (req.user.username !== req.post.author)
    return res.status(401).json({ message: `You can't delete this post.` });
  next();
};

exports.commentAuth = (req, res, next) => {
  if (req.user.id !== req.comment.authorId)
    return res.status(401).json({ error: `You can't delete this comment.` });
  next();
};
