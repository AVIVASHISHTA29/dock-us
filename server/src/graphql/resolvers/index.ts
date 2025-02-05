import { config } from "../../config/index.js";
import { TMDBService } from "../../services/tmdb.service.js";
import { Movie, Review } from "../../types/index.js";

// In-memory storage for reviews (in a real app, you'd use a database)
const reviews: Review[] = [];

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
      reviews
        .filter((review) => review.movieId === movie.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
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
