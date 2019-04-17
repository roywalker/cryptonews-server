const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // use query params for search
  //return res.json(db.posts);
});

router.get('/:id', (req, res) => {
  //return res.json(db.posts[req.params.id]);
});

router.get('/:post_id/comments', (req, res) => {
  // return res.json(
  //   db.comments.filter(
  //     comment => comment.post_id === parseInt(req.params.post_id)
  //   )
  // );
});

router.post('/', (req, res) => {
  // adds a new post
});

router.delete('/', (req, res) => {
  // deletes a post
});

// updates a post

module.exports = router;
