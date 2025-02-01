"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie } from "@/types/movie";
import { motion } from "framer-motion";
import { Calendar, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const Editor = dynamic(() => import("@/components/common/editor"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-64" />,
});

interface MovieDetailsProps {
  movie: Movie;
  onSubmitReview: (content: string) => Promise<void>;
}

export function MovieDetails({ movie, onSubmitReview }: MovieDetailsProps) {
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!review.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmitReview(review);
      setReview("");
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
      <MoviePoster
        posterPath={movie.posterPath}
        title={movie.title}
        voteAverage={movie.voteAverage}
        releaseDate={movie.releaseDate}
      />
      <div className="space-y-8">
        <MovieInfo title={movie.title} overview={movie.overview} />
        <Separator />
        <ReviewEditor
          value={review}
          onChange={setReview}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />
        <ReviewList reviews={movie.reviews} />
      </div>
    </div>
  );
}

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
  voteAverage: number;
  releaseDate: string;
}

function MoviePoster({
  posterPath,
  title,
  voteAverage,
  releaseDate,
}: MoviePosterProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        {posterPath ? (
          <Image
            src={posterPath}
            alt={title}
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
        <span className="font-semibold">{voteAverage.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>{new Date(releaseDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

interface MovieInfoProps {
  title: string;
  overview: string;
}

function MovieInfo({ title, overview }: MovieInfoProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
      <p className="text-lg leading-relaxed text-muted-foreground">
        {overview}
      </p>
    </div>
  );
}

interface ReviewEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ReviewEditor({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: ReviewEditorProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
      <Card className="p-4">
        <Editor value={value} onChange={onChange} />
        <div className="mt-4 flex justify-end">
          <Button onClick={onSubmit} disabled={!value.trim() || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ReviewListProps {
  reviews: Movie["reviews"];
}

function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Reviews
        <Badge variant="secondary" className="ml-2">
          {reviews.length}
        </Badge>
      </h2>
      {reviews.length === 0 ? (
        <Card className="p-6 text-center bg-muted/50">
          <p className="text-muted-foreground">
            No reviews yet. Be the first to write one!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
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
  );
}
