import { config } from "../../config/index.js";
import { TMDBService } from "../../services/tmdb.service.js";
import { Movie, Review } from "../../types/index.js";

// In-memory storage for reviews (in a real app, you'd use a database)
const reviews: Review[] = [];

export const resolvers = {
  Query: {
    popularMovies: async () => {
      const movies = await TMDBService.getPopularMovies();
      return movies.map(transformMovieData);
    },
    searchMovies: async (_: any, { query }: { query: string }) => {
      const movies = await TMDBService.searchMovies(query);
      return movies.map(transformMovieData);
    },
    movie: async (_: any, { id }: { id: number }) => {
      const movie = await TMDBService.getMovieById(id);
      return movie ? transformMovieData(movie) : null;
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
        ? `${config.tmdb.imageBaseUrl}${movie.posterPath}`
        : null,
    reviews: (movie: Movie) =>
      reviews.filter((review) => review.movieId === movie.id),
  },
};

function transformMovieData(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview || "",
    posterPath: movie.poster_path,
    releaseDate: movie.release_date || "",
    voteAverage: Number(movie.vote_average || 0),
  };
}
