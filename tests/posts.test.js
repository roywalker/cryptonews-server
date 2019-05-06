const request = require('supertest');
const app = require('../app');
const { restartDb, newUsername, createPost, createUser } = require('./helpers');

describe('Post endpoints', () => {
  const post = {
    title: {
      valid: 'abcde',
      short: 'a',
      long: 'a'.repeat(200)
    },
    url: {
      valid: 'http://a.com',
      invalid: 'a'
    }
  };

  const user = {
    password: 'v4alidPassword'
  };

  beforeAll(async () => {
    await restartDb();
  });

  beforeEach(async () => {
    user.username = newUsername();
    [user.id] = await createUser(user.username, user.password);
    [post.id] = await createPost(post.title.valid, post.url.valid, user.id);
  });

  describe('Unsecure endpoints', () => {
    test('returns a list of posts', done => {
      request(app)
        .get('/api/posts')
        .expect(res => {
          expect(res.body.results).toBeDefined();
          expect(res.body.results.length).toBeGreaterThan(0);
        })
        .expect(200, done);
    });

    test('returns a single post', done => {
      request(app)
        .get(`/api/post/${post.id.id}`)
        .expect(res => {
          expect(res.body.title).toBe(post.title.valid);
          expect(res.body.url).toBe(post.url.valid);
        })
        .expect(200, done);
    });
  });

  describe('Secure endpoints', () => {
    let token = null;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/login')
        .send(user);
      token = res.body.token;
    });

    test('reject requests without auth token', done => {
      request(app)
        .post('/api/post')
        .send({ title: post.title.valid, url: post.url.valid })
        .expect(401, done);
    });

    test('reject requests with missing fields', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
          expect(res.body.errors[1].msg).toMatch(/invalid url/i);
        })
        .expect(422, done);
    });

    test('reject requests with missing title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ url: post.url.valid })
        .expect(422, done);
    });

    test('reject requests with missing url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: post.title.valid })
        .expect(422, done);
    });

    test('reject requests with short title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: post.title.short, url: post.url.valid })
        .expect(422, done);
    });

    test('reject requests with long title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: post.title.long, url: post.url.valid })
        .expect(422, done);
    });

    test('reject requests with invalid url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: post.title.valid, url: post.url.invalid })
        .expect(422, done);
    });
  });
});
