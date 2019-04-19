require('dotenv').config();
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
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
}
module.exports = auth;
