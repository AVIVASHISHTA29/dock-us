import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from "node-fetch";

// Environment variables (you'll need to create a .env file)
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Types
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface Review {
  id: string;
  movieId: number;
  content: string;
  createdAt: string;
}

// In-memory storage for reviews (in a real app, you'd use a database)
const reviews: Review[] = [];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
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
    releaseDate: String
    voteAverage: Float
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    movieId: Int!
    content: String!
    createdAt: String!
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    popularMovies: async () => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      return data.results;
    },
    searchMovies: async (_: any, { query }: { query: string }) => {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`
      );
      const data = await response.json();
      return data.results;
    },
    movie: async (_: any, { id }: { id: number }) => {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      return response.json();
    },
    movieReviews: (_: any, { movieId }: { movieId: number }) => {
      return reviews.filter((review) => review.movieId === movieId);
    },
  },
  Mutation: {
    createReview: (
      _: any,
      { movieId, content }: { movieId: number; content: string }
    ) => {
      const review: Review = {
        id: Date.now().toString(),
        movieId,
        content,
        createdAt: new Date().toISOString(),
      };
      reviews.push(review);
      return review;
    },
  },
  Movie: {
    posterPath: (movie: Movie) =>
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
    reviews: (movie: Movie) =>
      reviews.filter((review) => review.movieId === movie.id),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
// Ensure the import is present

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
