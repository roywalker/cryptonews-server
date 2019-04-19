const express = require('express');
const router = express.Router();
const db = require('../data/helpers/user');
const { body, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');

router.post(
  '/',
  [
    body('username')
      .isLength({ min: 3, max: 20 })
      .withMessage(
        'Should be between 3 and 20 characters. Alphanumeric. Underscores allowed.'
      ),
    body('password')
      .matches(/password/i)
      .withMessage('Password should be password lol')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const hash = await bcrypt.hashSync(req.body.password, 10);
    const newUser = {
      username: req.body.username,
      password: hash,
      role: 'user'
    };

    const [id] = await db.addUser(newUser);
    const user = await db.getUser(id);

    res.status(201).json(user);
  }
);

router.delete('/', (req, res) => {
  // deletes a user
});

router.put('/', (req, res) => {
  // updates user password
});

module.exports = router;
