exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', table => {
    table.increments('id').primary();
    table.string('title', 256).notNullable();
    table.string('url').notNullable();
    table
      .integer('authorId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table.datetime('date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
