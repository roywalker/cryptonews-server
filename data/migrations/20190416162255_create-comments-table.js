exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', table => {
    table.increments('id').primary();
    table
      .integer('authorId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .integer('postId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('posts');
    table.text('comment').notNullable();
    table.datetime('date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments');
};
