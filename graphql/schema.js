const { gql } = require('apollo-server-express')

const typeDefs = gql`
  type Post {
    id: ID
    company: String
    colors: String
    featured: Boolean
    price: Int
    name: String
    imageId: String
    imageUrl: String
    imageLargeurl: String
    imageSmall: String
  }

  type Query {
    getAllPost: [Post]
  }

  input PostInput {
    company: String
    colors: String
    featured: Boolean
    price: Int
    name: String
    imageId: String
    imageUrl: String
    imageLargeurl: String
    imageSmall: String
  }

  type Mutation {
    createPost(post: PostInput): Post
  }
`

module.exports = typeDefs
