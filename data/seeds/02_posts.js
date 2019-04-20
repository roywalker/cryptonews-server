exports.seed = function(knex, Promise) {
  return knex('posts')
    .del()
    .then(function() {
      return knex('posts').insert([
        {
          title: `Can "stablecoins" be stable?`,
          url:
            'https://bankunderground.co.uk/2019/03/28/can-stablecoins-be-stable/',
          authorId: 1,
          localUrl: 'can-stablecoins-be-stable'
        },
        {
          title: `Bloomberg - Crypto Value Isn't Easy to Create With an Algorithm`,
          url:
            'https://www.bloomberg.com/opinion/articles/2019-03-29/crypto-value-isn-t-easy-to-create-with-an-algorithm',
          authorId: 2,
          localUrl:
            'bloomberg-crypto-value-isnt-easy-to-create-with-an-algorithm'
        },
        {
          title: 'Loopring Protocol 3.0: zkSNARKs for DEX Scalability',
          url:
            'https://medium.com/loopring-protocol/loopring-protocol-3-0-zksnarks-for-scalability-845b35a8b75b',
          authorId: 2,
          localUrl: 'loopring-protocol-30-zksnakrs-for-dex-scalability'
        }
      ]);
    });
};
