const router = require('express').Router();
const posts = require('./controllers/posts');
const users = require('./controllers/users');
const comments = require('./controllers/comments');
const { tokenAuth } = require('./auth');
const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;

router.post('/register', users.validate(), users.register);
router.post('/login', users.login);

router.param(['post'], posts.checkAndLoad);
router.get('/posts', posts.list);
router.get('/posts/:post', posts.view);
router.post('/posts/', tokenAuth, posts.validate(), posts.add);
router.delete('/posts/:post', tokenAuth, posts.delete);
router.post('/posts/:post/vote', tokenAuth, posts.checkAndLoad, posts.vote);

router.param(['comment'], comments.checkAndLoad);
router.post('/posts/:post/comments', tokenAuth, comments.valid(), comments.add);
router.delete('/posts/:post/comments/:comment', tokenAuth, comments.delete);

module.exports = app => {
  app.use('/api', router);

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
