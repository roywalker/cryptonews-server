const express = require('express');
const app = express();
const helmet = require('helmet');

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

app.use(express.json(), helmet());

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(3000, () => console.log('Listening in port 3000'));
