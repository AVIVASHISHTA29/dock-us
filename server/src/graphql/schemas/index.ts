export const typeDefs = `#graphql
  # The Query type defines all available queries that clients can execute
  type Query {
    popularMovies: [Movie!]!
    searchMovies(query: String!): [Movie!]!
    movie(id: Int!): Movie
    movieReviews(movieId: Int!): [Review!]!
  }

  type Mutation {
    createReview(movieId: Int!, content: String!): Review!
  }

  type Movie {
    id: Int!
    title: String!
    overview: String!
    posterPath: String
    releaseDate: String!
    voteAverage: Float!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    movieId: Int!
    content: String!
    createdAt: String!
  }
`;
