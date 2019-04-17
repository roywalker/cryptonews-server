exports.up = function(knex, Promise) {
  return knex.schema.createTable('upvotes', table => {
    table
      .integer('authorId')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .integer('postId')
      .unsigned()
      .references('id')
      .inTable('posts');
    table
      .integer('commentId')
      .unsigned()
      .references('id')
      .inTable('comments');
    table.datetime('date').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('upvotes');
};
