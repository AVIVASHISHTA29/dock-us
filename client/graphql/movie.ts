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

export const CREATE_REVIEW = gql`
  mutation CreateReview($movieId: Int!, $content: String!) {
    createReview(movieId: $movieId, content: $content) {
      id
      content
      createdAt
    }
  }
`;
