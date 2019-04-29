const passport = require('passport');
const { dbuser } = require('../data/helpers');

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await dbuser.getUserByUsername(username);
    if (!user) return done(null, false);

    const valid = '';
    if (!valid.verifyPassword(password)) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = localStrategy;
