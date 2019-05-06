const request = require('supertest');
const app = require('../app');
const {
  restartDb,
  createPost,
  createUser,
  sendVote,
  createComment
} = require('./helpers');

describe('Post endpoints', () => {
  let user1, user2, post1, post2, comment1;
  const title = {
    valid: 'abcde',
    short: 'a',
    long: 'a'.repeat(200)
  };
  const url = {
    valid: 'http://a.com',
    invalid: 'a'
  };
  const comment = {
    valid: 'a',
    long: 'a'.repeat(1000)
  };

  beforeAll(async () => {
    await restartDb();
  });

  beforeEach(async () => {
    user1 = await createUser();
    user2 = await createUser();
    [post1] = await createPost(title.valid, url.valid, user1.id);
    [post2] = await createPost(title.valid, url.valid, user2.id);
    comment1 = await createComment(user1.id, post1.id, comment.valid);
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

    test('rejects requests without auth token', done => {
      request(app)
        .post('/api/post')
        .send({ title: title.valid, url: url.valid })
        .expect(401, done);
    });

    test('rejects requests with missing fields', done => {
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

    test('rejects requests with missing title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with missing url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include an url/i);
        })
        .expect(422, done);
    });

    test('rejects requests with short title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.short, url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with long title', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.long, url: url.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/5 and 128 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with invalid url', done => {
      request(app)
        .post('/api/post')
        .set('token', token)
        .send({ title: title.valid, url: url.invalid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/invalid url/i);
        })
        .expect(422, done);
    });

    test('adds vote to a post', done => {
      request(app)
        .post(`/api/post/${post1.id}/vote`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.upvotes).toBe(1);
        })
        .expect(200, done);
    });

    test('removes vote to a post', async done => {
      await sendVote(user1.id, post1.id, null);
      request(app)
        .post(`/api/post/${post1.id}/vote`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.upvotes).toBe(0);
        })
        .expect(200, done);
    });

    test('deletes a post', done => {
      request(app)
        .delete(`/api/post/${post1.id}`)
        .set('token', token)
        .send()
        .expect(204, done);
    });

    test('rejects requests without ownership auth', async done => {
      request(app)
        .delete(`/api/post/${post2.id}`)
        .set('token', token)
        .send()
        .expect(res => {
          expect(res.body.message).toMatch(/can't delete/i);
        })
        .expect(401, done);
    });

    describe('Comments endpoints', () => {
      test('rejects requests with blank comment', done => {
        request(app)
          .post(`/api/post/${post1.id}/comments`)
          .set('token', token)
          .send()
          .expect(res => {
            expect(res.body.errors[0].msg).toMatch(/between 1 and 500/i);
          })
          .expect(422, done);
      });

      test('rejects requests with long comment', done => {
        request(app)
          .post(`/api/post/${post1.id}/comments`)
          .set('token', token)
          .send({ comment: comment.long })
          .expect(res => {
            expect(res.body.errors[0].msg).toMatch(/between 1 and 500/i);
          })
          .expect(422, done);
      });

      test('rejects requests associated with inexistent posts', done => {
        request(app)
          .post(`/api/post/${post2.id + 1}/comments`)
          .set('token', token)
          .send({ comment: comment.long })
          .expect(res => {
            expect(res.body.message).toMatch(/post not found/i);
          })
          .expect(404, done);
      });

      test('creates a new comment', done => {
        request(app)
          .post(`/api/post/${post1.id}/comments`)
          .set('token', token)
          .send({ comment: comment.valid })
          .expect(res => {
            expect(res.body.comment).toBe(comment.valid);
          })
          .expect(201, done);
      });

      test('adds vote to a comment', done => {
        request(app)
          .post(`/api/post/${post1.id}/comments/${comment1.id}/vote`)
          .set('token', token)
          .send()
          .expect(res => {
            expect(res.body.upvotes).toBe(1);
          })
          .expect(200, done);
      });

      test('removes vote to a comment', async done => {
        await sendVote(user1.id, null, comment1.id);
        request(app)
          .post(`/api/post/${post1.id}/comments/${comment1.id}/vote`)
          .set('token', token)
          .send()
          .expect(res => {
            expect(res.body.upvotes).toBe(0);
          })
          .expect(200, done);
      });

      test('deletes a comment', done => {
        request(app)
          .delete(`/api/post/${post1.id}/comments/${comment1.id}/`)
          .set('token', token)
          .send()
          .expect(204, done);
      });
    });
  });
});
