exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table
      .string('username', 24)
      .notNullable()
      .unique();
    table.string('password', 128).notNullable();
    table.string('role', 32).defaultTo('user');
    table.timestamp('date').defaultTo(new Date().toISOString());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
