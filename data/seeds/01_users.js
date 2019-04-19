exports.seed = function(knex, Promise) {
  return knex('users')
    .del()
    .then(function() {
      return knex('users').insert([
        { username: 'admin', password: 'hash', role: 'admin' },
        { username: 'roywalker', password: 'hash', role: 'user' },
        { username: 'jay', password: 'hash', role: 'user' }
      ]);
    });
};
