const express = require('express');
const router = express.Router();
const dbcomments = require('../data/helpers/comments');
const dbuser = require('../data/helpers/user');
const { body, param, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');

router.get('/author/:username/', async (req, res) => {
  // checks if user exists
  const username = req.params.username.toLowerCase();
  const [userExists] = await dbuser.getUserByUsername(username);
  if (!userExists) {
    return res.status(404).json({ error: `User doesn't exist.` });
  }

  // gets comments from user
  const comments = await dbcomments.getCommentsByAuthor(username);
  const formattedComments = comments.map(comment => {
    comment.post_url = `/api/posts/${comment.post_url}`;
  });

  // returns metadata and comments list
  return res.json({
    username_reference: username,
    count: comments.length,
    next: null,
    previous: null,
    results: comments
  });
});

router.post('/', (req, res) => {
  // adds a new comment
});

router.delete('/', (req, res) => {
  // deletes a comment
});

// updates a comment

module.exports = router;
