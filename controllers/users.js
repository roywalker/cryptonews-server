const { body, validationResult } = require('express-validator/check');
const { sanitizeParam } = require('express-validator/filter');
const { hashPassword, createJWT, checkPassword } = require('../auth');
const db = require('../data/helpers');

exports.validate = () => {
  return [
    sanitizeParam('username').customSanitizer(username => {
      return username.toLowerCase();
    }),

    body('username')
      .matches(/^\w*$/i)
      .withMessage('Must be alphanumeric characters. Underscores allowed.')

      .isLength({ min: 3, max: 24 })
      .withMessage('Must contain between 3 and 24 characters.')

      .custom(async username => {
        const userExists = await db.user.getByUsername(username);
        if (userExists) return false;
      })
      .withMessage('Username taken.'),

    body('password')
      .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/i)
      .withMessage(
        'Must include at least 1 lowercase letter, 1 uppercase letter and 1 digit.'
      )

      .isLength({ min: 10, max: 32 })
      .withMessage('Must contain between 10 and 32 characters.')
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
  const { username, password } = req.body;

  // checks for username
  const userExists = await db.user.getByUsername(username);
  if (!userExists)
    return res.status(401).json({ message: 'Username not found.' });

  // checks for password match
  const passwordMatch = await checkPassword(password, userExists.password);
  if (!passwordMatch)
    return res.status(401).json({ message: 'Incorrect password.' });

  const token = await createJWT(userExists.id, userExists.username);
  res.status(200).json({ token });
};
