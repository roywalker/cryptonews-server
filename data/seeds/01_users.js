exports.seed = function(knex, Promise) {
  return knex('users')
    .del()
    .then(function() {
      return knex('users').insert([
        { id: 1, username: 'admin', password: 'hash', role: 'admin' },
        { id: 2, username: 'roywalker', password: 'hash', role: 'user' },
        { id: 3, username: 'jay', password: 'hash', role: 'user' }
      ]);
    });
};
