const express = require('express');
const router = express.Router();
const { dbcomments, dbusers, dbposts } = require('../data/helpers');
const { body, param, validationResult } = require('express-validator/check');
const { auth } = require('../auth');

// prettier-ignore
router.post('/', auth, [
    body('postId')
      .isInt()
      .withMessage('Invalid post ID.'),
    body('comment')
      .trim()
      .escape()
      .isLength({ min: 1, max: 500 })
      .withMessage('Should at least have 1 character, and a maximum of 500.')
  ],
  async (req, res) => {
    // validates format
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    // validates post existence
    const [post] = await dbposts.getPostById(req.body.postId);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    // adds comment into db
    const [comment] = await dbcomments.addComment({
      authorId: req.headers.user,
      postId: req.body.postId,
      comment: req.body.comment
    });
    const addedComment = await dbcomments.getCommentById(comment);

    // returns comment from db
    return res.status(201).json(addedComment);
  }
);

// prettier-ignore
router.delete('/:commentId', auth, [
    param('commentId')
      .isInt()
      .withMessage('Invalid ID.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    // verifies comment existence
    const [comment] = await dbcomments.getCommentById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });

    // verifies comment ownership
    if (req.headers.user !== comment.authorId) {
      return res.status(401).json({
        error: 'You do not have authorization to delete this comment.'
      });
    }

    // deletes comment from db
    await dbcomments.deleteComment(req.params.commentId);

    // sends empty response (success)
    return res.status(204).json();
  }
);

router.get('/author/:username/', async (req, res) => {
  // checks if user exists
  const username = req.params.username.toLowerCase();
  const [userExists] = await dbuser.getUserByUsername(username);
  if (!userExists)
    return res.status(404).json({ error: `User doesn't exist.` });

  // gets comments from user and adds post url
  const comments = await dbcomments.getCommentsByAuthor(username);

  // returns metadata and comments list
  return res.json({
    username_reference: username,
    count: comments.length,
    next: null,
    previous: null,
    results: comments
  });
});

module.exports = router;
