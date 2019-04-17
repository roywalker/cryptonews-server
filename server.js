require('dotenv').config();

const express = require('express');
const app = express();
const helmet = require('helmet');

const PORT = process.env.PORT || 3000;

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

app.use(express.json(), helmet());

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
