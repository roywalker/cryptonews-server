const express = require('express');
const router = express.Router();
const db = require('../data/helpers/posts');

router.get('/', async (req, res) => {
  // TODO: use query params for search
  const posts = await db.getPosts();
  return res.json(posts);
});

router.get('/:id', async (req, res) => {
  const [post] = await db.getPost(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post not Found' });
  }

  return res.json(post);
});

router.get('/:postId/comments', async (req, res) => {
  const [post] = await db.getPost(req.params.postId);

  // validates post id
  if (!post) {
    return res.status(404).json({ error: "Post doesn't exist" });
  }

  const comments = await db.getPostComments(req.params.postId);
  return res.json(comments);
});

router.post('/', async (req, res) => {
  const newPost = {
    title: req.body.title,
    url: req.body.url,
    authorId: 1 // TODO: get author by AUTH params
  };

  const [id] = await db.addPost(newPost);
  const post = await db.getPost(id);

  return res.status(201).json(post);
});

router.delete('/:postId', async (req, res) => {
  const post = await db.deletePost(req.params.postId);

  if (!post) {
    return res.status(404).json({ error: "Post doesn't exist" });
  }

  return res.status(204).json();
});

// updates a post

module.exports = router;
