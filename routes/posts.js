const express = require('express');
const router = express.Router();
const db = require('../data/helpers/posts');
const { body, param, validationResult } = require('express-validator/check');

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
  // validates post id first
  const [post] = await db.getPost(req.params.postId);
  if (!post) {
    return res.status(404).json({ error: "Post doesn't exist" });
  }

  const comments = await db.getPostComments(req.params.postId);
  return res.json(comments);
});

// prettier-ignore
router.post('/', [
    body('title')
      .isLength({ min: 5, max: 128 }).trim().escape()
      .withMessage('You must include a post title.'),
    body('url')
      .isURL().trim().escape()
      .withMessage('You must include a valid URL.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const newPost = {
      title: req.body.title,
      url: req.body.url,
      authorId: 1 // TODO: get author by AUTH params
    };

    const [id] = await db.addPost(newPost);
    const post = await db.getPost(id);

    return res.status(201).json(post);
  }
);

// prettier-ignore
router.delete('/:postId', [
    param('postId').isInt().withMessage('Invalid ID.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // TODO: validate author with AUTH id
    const post = await db.deletePost(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post doesn't exist" });
    }

    return res.status(204).json();
  }
);

module.exports = router;
