const { body, validationResult } = require('express-validator/check');
const db = require('../data/helpers');

exports.valid = () => {
  return [
    body('comment')
      .trim()
      .escape()
      .isLength({ min: 1, max: 500 })
      .withMessage('Must contain between 1 and 500 characters.')
  ];
};

exports.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const comment = await db.comments.add({
    authorId: req.user.id,
    postId: req.post.id,
    comment: req.body.comment
  });

  return res.status(201).json(comment);
};

exports.delete = async (req, res) => {
  if (req.user.id !== req.comment.authorId) {
    return res.status(401).json({ error: `You can't delete this comment.` });
  }

  await db.comments.deleteComment(req.comment.id);
  return res.status(204).json();
};

exports.checkAndLoad = async (req, res, next, comment) => {
  req.comment = await db.comments.getCommentById(comment);
  if (!req.comment)
    return res.status(404).json({ message: 'Comment not found.' });
  next();
};
