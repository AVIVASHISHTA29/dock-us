"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { gql, useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const movieId = parseInt(params.id as string);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { id: movieId },
  });

  const [createReview] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: GET_MOVIE, variables: { id: movieId } }],
  });

  if (loading) return <MovieDetailSkeleton />;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive text-lg">Error: {error.message}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );

  const movie: Movie = data.movie;

  const handleSubmitReview = async () => {
    if (!review.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createReview({
        variables: {
          movieId,
          content: review,
        },
      });
      setReview("");
    } catch (err) {
      console.error("Error creating review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          <div className="space-y-4">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              {movie.posterPath ? (
                <Image
                  src={movie.posterPath}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  No poster available
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {movie.voteAverage.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-4">
                {movie.title}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {movie.overview}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
              <Card className="p-4">
                <Editor value={review} onChange={setReview} />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!review.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Reviews
                <Badge variant="secondary" className="ml-2">
                  {movie.reviews.length}
                </Badge>
              </h2>
              {movie.reviews.length === 0 ? (
                <Card className="p-6 text-center bg-muted/50">
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to write one!
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {movie.reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="p-6">
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: review.content }}
                        />
                        <div className="mt-4 flex items-center justify-end text-sm text-muted-foreground">
                          <time dateTime={review.createdAt}>
                            {new Date(review.createdAt).toLocaleDateString()} at{" "}
                            {new Date(review.createdAt).toLocaleTimeString()}
                          </time>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-24 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-px w-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
