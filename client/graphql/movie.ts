import { gql } from "@apollo/client";

export const GET_MOVIE = gql`
  query GetMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      overview
      posterPath
      releaseDate
      voteAverage
      reviews {
        id
        content
        createdAt
      }
    }
  }
`;

export const GET_POPULAR_MOVIES = gql`
  query GetPopularMovies($page: Int!) {
    popularMovies(page: $page) {
      page
      results {
        id
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
      totalPages
      totalResults
    }
  }
`;

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $page: Int) {
    searchMovies(query: $query, page: $page) {
      page
      results {
        id
        title
        overview
        posterPath
        releaseDate
        voteAverage
      }
      totalPages
      totalResults
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($movieId: Int!, $content: String!) {
    createReview(movieId: $movieId, content: $content) {
      id
      content
      createdAt
    }
  }
`;
