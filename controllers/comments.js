const { body, validationResult } = require('express-validator/check');
const db = require('../data/helpers');

exports.validate = () => {
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

  res.status(201).json(comment);
};

exports.delete = async (req, res) => {
  await db.comments.deleteComment(req.comment.id);
  res.status(204).end();
};

exports.load = async (req, res, next, comment) => {
  req.comment = await db.comments.findById(comment);
  if (!req.comment)
    return res.status(404).json({ message: 'Comment not found.' });
  next();
};

exports.vote = async (req, res) => {
  const votes = await db.votes.vote(req.user.id, null, req.comment.id);
  res.json({ upvotes: votes.count });
};
