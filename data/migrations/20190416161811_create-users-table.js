exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('username', 24).notNullable();
    table.string('password', 128).notNullable();
    table.string('role', 32).notNullable();
    table.datetime('date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
