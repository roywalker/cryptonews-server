exports.seed = function(knex, Promise) {
  return knex('votes')
    .del()
    .then(function() {
      return knex('votes').insert([
        { authorId: 2, postId: 1, commentId: null },
        { authorId: 2, postId: 2, commentId: null },
        { authorId: 2, postId: null, commentId: 1 },
        { authorId: 3, postId: null, commentId: 1 },
        { authorId: 3, postId: 3, commentId: null },
        { authorId: 3, postId: null, commentId: 2 }
      ]);
    });
};
