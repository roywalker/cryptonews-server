require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../data/helpers/user');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// prettier-ignore
router.post('/',[
    body('username')
      .matches(/^[a-zA-Z0-9]\w*[a-zA-Z0-9]$/i)
      .withMessage(
        'Should be alphanumeric characters. Underscores allowed between characters.'
      )
      .isLength({ min: 3, max: 24 })
      .withMessage('Should contain between 3 and 20 characters.'),
    body('password')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/i)
      .withMessage(
        'Should include at least 1 lowercase letter, 1 uppercase letter, 1 digit and 1 symbol.'
      )
      .isLength({ min: 10, max: 32 })
      .withMessage('Should contain between 10 and 32 characters.')
  ],
  async (req, res) => {
    // validates format
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // checks if username is taken
    const username = req.body.username.toLowerCase();
    const [usernameInUse] = await db.getUserByUsername(username);
    if (usernameInUse) {
      return res.status(422).json({ error: 'Username taken.' });
    }

    // creates user object
    const hash = await bcrypt.hashSync(req.body.password, 10);
    const newUser = {
      username: username,
      password: hash
    };

    // adds user to db
    const [id] = await db.addUser(newUser);

    // creates auth token
    const token = await jwt.sign({ user: id }, process.env.JWT_SECRET, {
      expiresIn: '14d'
    });

    // returns token details
    res.status(201).json({
      success: 'User created',
      username: username,
      token: token
    });
  }
);

router.delete('/', (req, res) => {
  // deletes a user
});

router.put('/', (req, res) => {
  // updates user password
});

module.exports = router;
