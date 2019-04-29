const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

exports.createJWT = user => {
  return jwt.sign({ user }, config.jwt.secret, {
    expiresIn: config.jwt.expires
  });
};

exports.verifyJWT = () => {};

exports.auth = async (req, res, next) => {
  if (!req.headers.token) {
    return res.status(401).json({
      error: 'You must include an authorization token to access this endpoint.'
    });
  }

  try {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
    req.headers.user = decoded.user;
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  next();
};
