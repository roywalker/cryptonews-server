const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const userRouter = require('./routes/user');
const upvotesRouter = require('./routes/upvotes');
const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;

module.exports = app => {
  app.use('/api/user', userRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/upvotes', upvotesRouter);

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'bad request' });
    }
    winston.error(err.message, err);
    return res.status(500).json({ message: 'internal error' });
  });
};

winston.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: combine(timestamp(), prettyPrint())
  })
);
