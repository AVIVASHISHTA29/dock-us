import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables from .env file
dotenv.config();

// Environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE_URL =
  process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

// Types
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
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

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
  Query: {
    popularMovies: async () => {
      try {
        if (!TMDB_API_KEY) {
          console.error("TMDB_API_KEY is not set in environment variables");
          return [];
        }

        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?language=en-US&page=1&sort_by=popularity.desc`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_API_KEY.trim()}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TMDB API Error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          return [];
        }

        const data = await response.json();
        console.log("TMDB API Response:", JSON.stringify(data, null, 2));

        if (!data.results) {
          console.error("No results in TMDB response:", data);
          return [];
        }

        return data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview || "",
          posterPath: movie.poster_path,
          releaseDate: movie.release_date || "",
          voteAverage: Number(movie.vote_average || 0),
        }));
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
      }
    },
    searchMovies: async (_: any, { query }: { query: string }) => {
      try {
        if (!TMDB_API_KEY) {
          console.error("TMDB_API_KEY is not set in environment variables");
          return [];
        }

        const response = await fetch(
          `${TMDB_BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(
            query
          )}&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_API_KEY.trim()}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TMDB API Error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          return [];
        }

        const data = await response.json();
        console.log("TMDB Search API Response:", JSON.stringify(data, null, 2));

        if (!data.results) {
          console.error("No results in TMDB search response:", data);
          return [];
        }

        return data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview || "",
          posterPath: movie.poster_path,
          releaseDate: movie.release_date || "",
          voteAverage: Number(movie.vote_average || 0),
        }));
      } catch (error) {
        console.error("Error searching movies:", error);
        return [];
      }
    },
    movie: async (_: any, { id }: { id: number }) => {
      try {
        if (!TMDB_API_KEY) {
          console.error("TMDB_API_KEY is not set in environment variables");
          return null;
        }

        const response = await fetch(
          `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_API_KEY.trim()}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("TMDB API Error:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          return null;
        }

        const movie = await response.json();
        console.log("TMDB Movie API Response:", JSON.stringify(movie, null, 2));

        if (!movie || movie.status_code === 34) {
          console.error("No movie found or invalid response:", movie);
          return null;
        }

        return {
          id: movie.id,
          title: movie.title,
          overview: movie.overview || "",
          posterPath: movie.poster_path,
          releaseDate: movie.release_date || "",
          voteAverage: Number(movie.vote_average || 0),
        };
      } catch (error) {
        console.error("Error fetching movie:", error);
        return null;
      }
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
      movie.posterPath
        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
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
