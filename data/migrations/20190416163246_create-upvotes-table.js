exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', table => {
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
    table.timestamp('date').defaultTo(new Date().toISOString());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('votes');
};
