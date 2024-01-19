const Store = require('../modules/storeItems')

const resolvers = {
  Query: {
    getAllPost: async () => {
      return await Store.find()
    },
  },

  Mutation: {
    createPost: async (
      _,
      {
        post: {
          company,
          colors,
          featured,
          price,
          name,
          imageId,
          imageUrl,
          imageLargeurl,
          imageSmall,
        },
      }
    ) => {
      const post = new Store({
        company,
        colors,
        featured,
        price,
        name,
        imageId,
        imageUrl,
        imageLargeurl,
        imageSmall,
      })
      await post.save()
      return post
    },
  },
}

module.exports = resolvers
