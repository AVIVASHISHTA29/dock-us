// TMDB API Types
export interface TMDBMovieResult {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TMDBResponse {
  results: TMDBMovieResult[];
}

export interface TMDBMovieDetails extends TMDBMovieResult {
  status_code?: number;
}

// App Types
export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
}

export interface Review {
  id: string;
  movieId: number;
  content: string;
  createdAt: string;
}
