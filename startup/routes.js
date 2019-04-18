const express = require('express');
const helmet = require('helmet');
const postsRouter = require('../routes/posts');
const commentsRouter = require('../routes/comments');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');
const errors = require('../middleware/errors');

module.exports = app => {
  app.use(express.json(), helmet());
  app.use('/api/posts', postsRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/user', userRouter);
  app.use('/api/auth', authRouter);
  app.use(errors);
};
