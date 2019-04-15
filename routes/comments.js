const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/post/:post_id/', (req, res) => {
  return res.json(
    db.comments.filter(
      comment => comment.post_id === parseInt(req.params.post_id)
    )
  );
});

router.get('/author/:author_id/', (req, res) => {
  return res.json(
    db.comments.filter(
      comment => comment.author_id === parseInt(req.params.author_id)
    )
  );
});

router.post('/', (req, res) => {
  // adds a new comment
});

router.delete('/', (req, res) => {
  // deletes a comment
});

// updates a comment

module.exports = router;
