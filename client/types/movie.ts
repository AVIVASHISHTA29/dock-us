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
  releaseDate?: string;
  voteAverage: number;
  reviews?: Review[];
}

export interface PopularMoviesResponse {
  popularMovies: Movie[];
}

export interface SearchMoviesResponse {
  searchMovies: Movie[];
}
