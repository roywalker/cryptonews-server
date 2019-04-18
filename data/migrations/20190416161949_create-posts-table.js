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
    table.timestamp('date').defaultTo(new Date().toISOString());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts');
};
