const { body, validationResult } = require('express-validator/check');
const db = require('../data/helpers');
const urlSlug = require('url-slug');
const nanoid = require('nanoid/generate');

exports.validate = () => {
  return [
    body('title')
      .isLength({ min: 5, max: 128 })
      .trim()
      .escape()
      .withMessage('Must contain between 5 and 128 characters.'),

    body('url')
      .isURL()
      .withMessage('Invalid URL.')
  ];
};

exports.load = async (req, res, next, post) => {
  req.post = await db.posts.findById(post);
  if (!req.post) return res.status(404).json({ message: 'Post not found.' });
  next();
};

exports.list = async (req, res) => {
  // TODO: add pagination (query params)
  const posts = await db.posts.list();
  return res.json({
    count: posts.length,
    next: null,
    previous: null,
    results: posts
  });
};

exports.view = async (req, res) => {
  // TODO: add pagination (query params)
  const comments = await db.comments.findByPost(req.post.id);
  req.post.comments = {
    count: comments.length,
    next: null,
    previous: null,
    results: comments
  };

  res.json(req.post);
};

exports.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const post = await db.posts.add({
    title: req.body.title,
    url: req.body.url,
    authorId: req.user.id,
    localUrl: this.generateSlug(req.body.title)
  });

  res.status(201).json(post);
};

exports.delete = async (req, res) => {
  await db.posts.delete(req.post.id);
  res.status(204).end();
};

exports.vote = async (req, res) => {
  const votes = await db.votes.vote(req.user.id, req.post.id, null);
  res.json({ upvotes: votes.count });
};

exports.generateSlug = title => {
  return urlSlug(title) + '-' + nanoid('1234567890abcdef', 12);
};
