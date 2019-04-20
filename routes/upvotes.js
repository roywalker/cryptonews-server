const express = require('express');
const router = express.Router();
const { dbposts, dbcomments, dbupvotes } = require('../data/helpers/db');
const { param, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

router.post(
  '/:type/:contentId',
  auth,
  [
    param('contentId')
      .isInt()
      .withMessage('Invalid ID.'),
    param('type').matches(/^(post|comment)$/i)
  ],
  async (req, res) => {
    // validates format
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const type = req.params.type.toLowerCase();

    // creates upvote object
    const upvote = {
      authorId: req.headers.user
    };

    if (type === 'post') {
      // validates post existence
      const [post] = await dbposts.getPostById(req.params.contentId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      upvote.postId = post.id;
    } else if (type === 'comment') {
      // validates comment existence
      const [comment] = await dbcomments.getCommentById(req.params.contentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found.' });
      }
      upvote.commentId = comment.id;
    }

    // adds or removes upvote based on existence
    const [upvoted] = await dbupvotes.verifyUpvote(upvote);
    let action;
    if (!upvoted) {
      await dbupvotes.addUpvote(upvote);
      action = 'Upvote added';
    } else {
      await dbupvotes.removeUpvote(upvote);
      action = 'Upvote removed';
    }

    // returns upvote action
    return res.status(200).json({
      success: action,
      type: type,
      id: req.params.contentId
    });
  }
);

module.exports = router;
