const request = require('supertest');
const app = require('../app');
const { cleanDb, create, verifyJWT } = require('./helpers');

describe('Auth endpoints', () => {
  let user1;
  const username = {
    short: 'a',
    long: 'a'.repeat(50),
    invalid: 'a@!#$'
  };
  const password = {
    valid: 'v4lidPassword',
    short: 'abc',
    long: 'a'.repeat(50),
    noDigits: 'randomPassword',
    noUppercase: 'r4andompassword'
  };

  beforeAll(async () => {
    await cleanDb();
  });

  beforeEach(async () => {
    username.available = create.username();
    user1 = await create.user();
  });

  describe('/api/login', () => {
    it('rejects requests without credentials', done => {
      request(app)
        .post('/api/login')
        .send()
        .expect(res => {
          res.body.errors.forEach(err => {
            expect(err.msg).toMatch(/must include credentials/i);
          });
        })
        .expect(422, done);
    });

    test('rejects requests with blank password', done => {
      request(app)
        .post('/api/login')
        .send({ username: user1.username })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include credentials/i);
        })
        .expect(422, done);
    });

    test('rejects requests with blank username', done => {
      request(app)
        .post('/api/login')
        .send({ password: password.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include credentials/i);
        })
        .expect(422, done);
    });

    test('rejects requests with incorrect password', done => {
      request(app)
        .post('/api/login')
        .send({ username: user1.username, password: password.short })
        .expect(res => {
          expect(res.body.message).toMatch(/invalid password/i);
        })
        .expect(401, done);
    });

    test('returns a valid auth token', done => {
      request(app)
        .post('/api/login')
        .send({ username: user1.username, password: password.valid })
        .expect(res => {
          const { token } = res.body;
          expect(token).toBeDefined();
          expect(verifyJWT(token, user1.username)).toBeTruthy();
        })
        .expect(200, done);
    });
  });

  describe('/api/register', () => {
    test('rejects requests with invalid characters in the username', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.invalid, password: password.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/alphanumeric characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with long username', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.long, password: password.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/between 3 and 24/i);
        })
        .expect(422, done);
    });

    test('rejects requests with short username', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.short, password: password.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/between 3 and 24/i);
        })
        .expect(422, done);
    });

    test('rejects requests when username is taken', done => {
      request(app)
        .post('/api/register')
        .send({ username: user1.username, password: password.valid })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/username taken/i);
        })
        .expect(422, done);
    });

    test('rejects requests with blank password', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/10 and 32 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with short password', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available, password: password.short })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/10 and 32 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with long password', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available, password: password.long })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/10 and 32 characters/i);
        })
        .expect(422, done);
    });

    test('rejects requests with password without uppercase letters', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available, password: password.noUppercase })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include at least/i);
        })
        .expect(422, done);
    });

    test('rejects requests with password without digits', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available, password: password.noDigits })
        .expect(res => {
          expect(res.body.errors[0].msg).toMatch(/must include at least/i);
        })
        .expect(422, done);
    });

    it('creates a new user and returns auth token', done => {
      request(app)
        .post('/api/register')
        .send({ username: username.available, password: password.valid })
        .expect(res => {
          const { token } = res.body;
          expect(token).toBeDefined();
          expect(verifyJWT(token, username.available)).toBeTruthy();
        })
        .expect(201, done);
    });
  });
});
