"use client";

import { MovieDetails } from "@/components/movie/movie-details";
import { MovieDetailSkeleton } from "@/components/skeletons/movie-detail-skeleton";
import { Button } from "@/components/ui/button";
import { useMovie } from "@/hooks/use-movie";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const { loading, error, movie, submitReview } = useMovie(movieId);

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
        {movie && <MovieDetails movie={movie} onSubmitReview={submitReview} />}
      </div>
    </motion.main>
  );
}
