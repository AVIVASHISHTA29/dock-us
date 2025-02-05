export interface Review {
  id: string;
  content: string;
  createdAt: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  reviews?: Review[];
}

export interface MoviePaginatedResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface PopularMoviesResponse {
  popularMovies: MoviePaginatedResponse;
}

export interface SearchMoviesResponse {
  searchMovies: MoviePaginatedResponse;
}
