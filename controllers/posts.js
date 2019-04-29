const { body } = require('express-validator/check');

exports.validate = () => {
  return [
    body('title')
      .isLength({ min: 5, max: 128 })
      .trim()
      .escape()
      .withMessage('Should contain between 5 and 128 characters.'),

    body('url')
      .isURL()
      .trim()
      .withMessage('Should be a valid URL.')
  ];
};

exports.check = async (req, res, next, id) => {};
