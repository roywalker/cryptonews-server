const posts = require('./controllers/posts');
const users = require('./controllers/users');
const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const upvotesRouter = require('./routes/upvotes');

module.exports = app => {
  app.post('/api/register', users.validate(), users.register);
  app.post('/api/login', users.login);

  app.param(['localUrl', 'postId'], posts.check);
  app.use('/api/posts', postsRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/upvotes', upvotesRouter);

  app.get('*', (req, res) => {
    res.status(404).json({ message: 'Not found.' });
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'Bad request.' });
    }
    winston.error(err.message, err);
    return res.status(500).json({ message: 'Internal error.' });
  });
};

winston.add(
  new winston.transports.Console({
    handleExceptions: true,
    format: combine(timestamp(), prettyPrint())
  })
);
