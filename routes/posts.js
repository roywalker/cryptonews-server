const express = require('express');
const router = express.Router();
const db = require('../data/helpers/posts');
const { body, param, validationResult } = require('express-validator/check');
const auth = require('../middleware/auth');
const slugify = require('../helpers/slugify');

router.get('/', async (req, res) => {
  // TODO: add pagination (query params)
  // gets posts and adds static link
  const posts = await db.getPosts();
  const formattedPosts = posts.map(post => {
    post.link = `/api/posts/${post.id}`;
    return post;
  });

  // returns metadata and posts list
  return res.json({
    count: posts.length,
    next: null,
    previous: null,
    results: formattedPosts
  });
});

router.get('/:id', async (req, res) => {
  const [post] = await db.getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not Found' });
  }
  post.link = `/api/posts/${post.id}`;

  // TODO: get comments from post

  return res.json(post);
});

router.get('/:postId/comments', async (req, res) => {
  // TODO: add pagination (query params)
  // validates post id first
  const [post] = await db.getPostById(req.params.postId);
  if (!post) {
    return res.status(404).json({ error: "Post doesn't exist" });
  }
  post.link = `/api/posts/${post.id}`;

  // brings comments from db
  const comments = await db.getPostComments(req.params.postId);

  // returns metadata and comments list
  return res.json({
    post_reference_link: post.link,
    count: comments.length,
    next: null,
    previous: null,
    results: comments
  });
});

// prettier-ignore
router.post('/', auth, [
    body('title')
      .isLength({ min: 5, max: 128 }).trim().escape()
      .withMessage('Should contain between 5 and 128 characters.'),
    body('url')
      .isURL().trim()
      .withMessage('Should be a valid URL.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // creates new url slug
    let urlSlug = req.body.title;
    let validSlug = false;
    while (!validSlug) {
      urlSlug = slugify(urlSlug);
      const [slugExists] = await db.getPostByUrlSlug(urlSlug);
      
      if (slugExists) {
        urlSlug += `-${Math.floor(Math.random()*100000)}`;
      } else {
        break;
      }
    }

    // creates post object
    const newPost = {
      title: req.body.title,
      url: req.body.url,
      authorId: req.headers.user,
      localUrlSlug: urlSlug
    };

    // adds posts into db and retrieves post details
    const [id] = await db.addPost(newPost);
    const post = await db.getPostById(id);

    // returns post details
    return res.status(201).json(post);
  }
);

// prettier-ignore
router.delete('/:postId', auth, [
    param('postId').isInt().withMessage('Invalid ID.')
  ],
  async (req, res) => {
    // validates format
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // verifies post existence
    const [post] = await db.getPostById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post doesn't exist." });
    }

    // verifies ownership
    if (req.headers.user !== post.authorId) {
      return res.status(401).json({error: "You do not have authorization to delete this post."})
    }

    // deletes posts from db
    await db.deletePost(req.params.postId);

    // sends empty response (success)
    return res.status(204).json();
  }
);

module.exports = router;
