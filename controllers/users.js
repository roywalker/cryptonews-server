const { body, validationResult } = require('express-validator/check');
const { sanitizeParam } = require('express-validator/filter');
const { hashPassword, createJWT } = require('../auth');
const { dbuser } = require('../data/helpers');

exports.validate = () => {
  return [
    sanitizeParam('username').customSanitizer(username => {
      return username.toLowerCase();
    }),

    body('username')
      .matches(/^[a-zA-Z0-9]\w*[a-zA-Z0-9]$/i)
      .withMessage(
        'Should be alphanumeric characters. Underscores allowed between characters.'
      )

      .isLength({ min: 3, max: 24 })
      .withMessage('Should contain between 3 and 20 characters.')

      .custom(async username => {
        const [userExists] = await dbuser.getUserByUsername(username);
        if (userExists) return false;
      })
      .withMessage('Username taken.'),

    body('password')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/i)
      .withMessage(
        'Should include at least 1 lowercase letter, 1 uppercase letter, 1 digit and 1 symbol.'
      )

      .isLength({ min: 10, max: 32 })
      .withMessage('Should contain between 10 and 32 characters.')
  ];
};

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const [newUserId] = await dbuser.addUser({
    username: req.body.username,
    password: await hashPassword(req.body.password)
  });

  const token = createJWT(newUserId);

  res.status(201).json({ token });
};
