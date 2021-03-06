const { body, validationResult } = require('express-validator/check');
const { hashPassword, createJWT, checkPassword } = require('./auth');
const db = require('../data/helpers');

exports.validateRegister = () => {
  return [
    body('username')
      .customSanitizer(username => {
        return username.toLowerCase();
      })

      .matches(/^\w*$/i)
      .withMessage('Must be alphanumeric characters. Underscores allowed.')

      .isLength({ min: 3, max: 24 })
      .withMessage('Must contain between 3 and 24 characters.')

      .custom(async username => {
        const userExists = await db.user.findByUsername(username);
        if (userExists) return false;
      })
      .withMessage('Username taken.'),

    body('password')
      .isLength({ min: 10, max: 32 })
      .withMessage('Must contain between 10 and 32 characters.')

      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
      .withMessage(
        'Must include at least 1 lowercase letter, 1 uppercase letter and 1 digit.'
      )
  ];
};

exports.validateLogin = () => {
  return [
    body('username')
      .customSanitizer(username => {
        return username.toLowerCase();
      })

      .isLength({ min: 1 })
      .withMessage('Must include credentials.'),

    body('password')
      .isLength({ min: 1 })
      .withMessage('Must include credentials.')
  ];
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(422)
      .json({ errors: errors.array({ onlyFirstError: true }) });

  const [newUserId] = await db.user.add({
    username: req.body.username,
    password: await hashPassword(req.body.password)
  });

  const token = createJWT(newUserId, req.body.username);
  res.status(201).json({ token });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(422)
      .json({ errors: errors.array({ onlyFirstError: true }) });

  const { username, password } = req.body;

  const user = await db.user.findByUsername(username);
  if (!user) return res.status(401).json({ message: 'User not found.' });

  const passwordMatch = await checkPassword(password, user.password);
  if (!passwordMatch)
    return res.status(401).json({ message: 'Invalid password.' });

  const token = await createJWT(user.id, user.username);
  res.status(200).json({ token });
};
