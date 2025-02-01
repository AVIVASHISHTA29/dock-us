import { CREATE_REVIEW, GET_MOVIE } from "@/graphql/movie";
import { Movie } from "@/types/movie";
import { useMutation, useQuery } from "@apollo/client";

interface UseMovieReturn {
  loading: boolean;
  error?: Error;
  movie?: Movie;
  submitReview: (content: string) => Promise<void>;
}

export function useMovie(movieId: number): UseMovieReturn {
  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { id: movieId },
  });

  const [createReview] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_MOVIE, variables: { id: movieId } }],
  });

  const submitReview = async (content: string) => {
    if (!content.trim()) return;

    try {
      await createReview({
        variables: {
          movieId,
          content,
        },
      });
    } catch (err) {
      console.error("Error creating review:", err);
      throw err;
    }
  };

  return {
    loading,
    error: error as Error | undefined,
    movie: data?.movie,
    submitReview,
  };
}
