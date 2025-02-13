import { config } from "../../config/index.js";
import { ReviewsService } from "../../services/reviews.service.js";
import { TMDBService } from "../../services/tmdb.service.js";
import { Movie } from "../../types/index.js";

export const resolvers = {
  Query: {
    popularMovies: async (_: any, { page }: { page: number }) => {
      const response = await TMDBService.getPopularMovies(page);
      return {
        page: response.page,
        results: response.results.map(transformMovieData),
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      };
    },
    searchMovies: async (
      _: any,
      { query, page }: { query: string; page: number }
    ) => {
      const response = await TMDBService.searchMovies(query, page);
      return {
        page: response.page,
        results: response.results.map(transformMovieData),
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      };
    },
    movie: async (_: any, { id }: { id: number }) => {
      const movie = await TMDBService.getMovieById(id);
      return movie ? transformMovieData(movie) : null;
    },
    movieReviews: (_: any, { movieId }: { movieId: number }) => {
      return ReviewsService.getReviewsByMovieId(movieId);
    },
  },
  Mutation: {
    createReview: (
      _: any,
      { movieId, content }: { movieId: number; content: string }
    ) => {
      return ReviewsService.createReview(movieId, content);
    },
  },
  Movie: {
    posterPath: (movie: Movie) =>
      movie.posterPath
        ? `${config.tmdb.imageBaseUrl}${movie.posterPath}`
        : null,
    reviews: (movie: Movie) => ReviewsService.getReviewsByMovieId(movie.id),
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
