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
  query GetPopularMovies {
    popularMovies {
      id
      title
      overview
      posterPath
      voteAverage
    }
  }
`;

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      id
      title
      overview
      posterPath
      voteAverage
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
