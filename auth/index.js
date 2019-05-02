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

exports.verifyJWT = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return false;
  }
};

exports.tokenAuth = (req, res, next) => {
  if (!req.headers.token)
    return res.status(401).json({
      error: 'You must include an authorization token to access this endpoint.'
    });

  const decoded = this.verifyJWT(req.headers.token, process.env.JWT_SECRET);
  if (!decoded) return res.status(401).json({ error: 'Invalid token.' });

  req.user = decoded.user;
  next();
};
