export const typeDefs = `#graphql
  # The Query type defines all available queries that clients can execute
  type Query {
    popularMovies(page:Int!): MoviePaginatedResponse!
    searchMovies(query: String!, page:Int): MoviePaginatedResponse!
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

  type MoviePaginatedResponse {
    page: Int!
    results: [Movie!]!
    totalPages: Int!
    totalResults: Int!
  }
`;
