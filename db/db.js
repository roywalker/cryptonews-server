const posts = [
  {
    id: 0,
    title: 'First post',
    url: 'first-post-12345',
    date: '1555344782554',
    author: 0
  },
  {
    id: 1,
    title: 'Second post',
    url: 'second-post-67890',
    date: '1555344782554',
    author: 1
  }
];

const users = [
  {
    id: 0,
    username: 'roywalker',
    password: 'hash',
    role: 'admin'
  },
  {
    id: 1,
    username: 'adam',
    password: 'hash',
    role: ''
  }
];

const comments = [
  {
    id: 0,
    author_id: 0,
    post_id: 0,
    comment: 'Hey, this is the first comment in the first post!',
    date: '1555344782554'
  },
  {
    id: 1,
    author_id: 1,
    post_id: 0,
    comment: 'Hey, this is the second comment in the first post!',
    date: '1555344782554'
  }
];

const upvotes = [
  {
    post_id: 0,
    commment_id: null,
    author_id: 0,
    date: '1555344782554'
  },
  {
    post_id: 0,
    commment_id: null,
    author_id: 1,
    date: '1555344782554'
  },
  {
    post_id: null,
    commment_id: 0,
    author_id: 1,
    date: '1555344782554'
  }
];

module.exports = { posts, users, comments, upvotes };
