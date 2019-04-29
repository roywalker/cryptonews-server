require('dotenv').config();
const express = require('express');
const router = express.Router();
const { dbuser } = require('../data/helpers');
const { body, validationResult } = require('express-validator/check');
const users = require('../controllers/users');
const jwt = require('jsonwebtoken');

router.post('/signup', users.validate(), users.createUser);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // checks for username
  const [userExists] = await dbuser.getUserByUsername(username);
  if (!userExists)
    return res.status(401).json({ error: 'Username not found.' });

  // checks for password match
  const passwordMatch = bcrypt.compareSync(password, userExists.password);
  if (!passwordMatch) {
    return res
      .status(401)
      .json({ error: `Incorrect password for username '${username}'.` });
  }

  // creates auth token
  const token = await jwt.sign(
    { user: userExists.id },
    process.env.JWT_SECRET,
    { expiresIn: '14d' }
  );

  // returns token details
  res.status(200).json({
    success: 'Authorization granted.',
    username: username,
    token: token
  });
});

module.exports = router;
