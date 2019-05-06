const request = require('supertest');
const app = require('../app');
const { restartDb, createPost, createUser, sendVote } = require('./helpers');

describe('Post endpoints', () => {
  let user1, user2, post1, post2;
  const title = {
    valid: 'abcde',
    short: 'a',
    long: 'a'.repeat(200)
  };
  const url = {
    valid: 'http://a.com',
    invalid: 'a'
  };

  beforeAll(async () => {
    await restartDb();
  });

  beforeEach(async () => {
    user1 = await createUser();
    user2 = await createUser();
    [post1] = await createPost(title.valid, url.valid, user1.id);
    [post2] = await createPost(title.valid, url.valid, user2.id);
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
        .get(`/api/post/${post1.id}`)
        .expect(res => {
          expect(res.body.title).toBe(title.valid);
          expect(res.body.url).toBe(url.valid);
        })
        .expect(200, done);
    });
  });

  describe('Secure endpoints', () => {
    let token = null;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/login')
        .send(user1);
      token = res.body.token;
    });

    test('reject requests without auth token', done => {
      request(app)
        .post('/api/post')
        .send({ title: title.valid, url: url.valid })
        .expect(401, done);
    });

    test('reject requests with missing fields', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
          expect(res.body.errors[1].msg).toMatch(/must include an url/i);
        })
        .expect(422, done);
    });

    test('reject requests with missing title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('reject requests with missing url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include an url/i);
        })
        .expect(422, done);
    });

    test('reject requests with short title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.short, url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('reject requests with long title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.long, url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('reject requests with invalid url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.valid, url: url.invalid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/invalid url/i);
        })
        .expect(422, done);
    });

    test('register a positive vote', done => {
      request(app)
        .post(`/api/post/${post1.id}/vote`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.upvotes).toBe(1);
        })
        .expect(200, done);
    });

    test('register a negative vote', done => {
      sendVote(user1.id, post1.id);
      request(app)
        .post(`/api/post/${post1.id}/vote`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.upvotes).toBe(0);
        })
        .expect(200, done);
    });

    test('delete a post', done => {
      request(app)
        .delete(`/api/post/${post1.id}`)
        .set('token', token)
        .send()
        .expect(204, done);
    });

    test('reject requests without ownership auth', async done => {
      request(app)
        .delete(`/api/post/${post2.id}`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.message).toMatch(/can't delete/i);
        })
        .expect(401, done);
    });
  });
});
