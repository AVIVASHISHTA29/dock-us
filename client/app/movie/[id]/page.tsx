"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { gql, useMutation, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-64" />,
});

const GET_MOVIE = gql`
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

const CREATE_REVIEW = gql`
  mutation CreateReview($movieId: Int!, $content: String!) {
    createReview(movieId: $movieId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

interface Review {
  id: string;
  content: string;
  createdAt: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  reviews: Review[];
}

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);
  const [review, setReview] = useState("");

  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { id: movieId },
  });

  const [createReview] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_MOVIE, variables: { id: movieId } }],
  });

  if (loading) return <MovieDetailSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  const movie: Movie = data.movie;

  const handleSubmitReview = async () => {
    if (!review.trim()) return;

    try {
      await createReview({
        variables: {
          movieId,
          content: review,
        },
      });
      setReview("");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div>
          {movie.posterPath ? (
            <Image
              src={movie.posterPath}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
              No poster available
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-lg mb-4">{movie.overview}</p>
          <div className="flex gap-4 text-sm text-muted-foreground mb-8">
            <p>
              Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p>Rating: {movie.voteAverage.toFixed(1)}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            <Editor value={review} onChange={setReview} />
            <Button onClick={handleSubmitReview} className="mt-4">
              Submit Review
            </Button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {movie.reviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to write one!
              </p>
            ) : (
              <div className="space-y-4">
                {movie.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Posted on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function MovieDetailSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <Skeleton className="w-full aspect-[2/3]" />
        <div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
