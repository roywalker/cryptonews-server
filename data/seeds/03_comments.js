exports.seed = function(knex, Promise) {
  return knex('comments')
    .del()
    .then(function() {
      return knex('comments').insert([
        {
          authorId: 2,
          postId: 1,
          comment: `Hitchhikers Guide was one of the first PC games I ever got. I had no idea it was a “text adventure.” Nor did I understand it was based on a book.
          My dad got it for me used from The Computer Club in downtown Lake Oswego, Oregon. I picked it out largely due to the green guy on the front of the box.
          I remember being delighted by all the weird stuff it came with, including a small packet of fuzz, and other artifacts from the story. I didn’t know why they were in the box but it was weird and that appealed to me.
          `
        },
        {
          authorId: 3,
          postId: 1,
          comment: `I love interactive fiction (as these types of games are now denoted) then and now. In principle. There are possibilities with the text-only canvas that are not even conceivable in other media.`
        },
        {
          authorId: 2,
          postId: 2,
          comment: `Is there any good modern analogue to Infocom games that I can plan on my iPhone slowly?`
        }
      ]);
    });
};
