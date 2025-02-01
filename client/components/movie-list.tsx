"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const GET_POPULAR_MOVIES = gql`
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

const SEARCH_MOVIES = gql`
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

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  voteAverage: number;
}

export default function MovieList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");

  const { loading, error, data } = useQuery(
    searchQuery ? SEARCH_MOVIES : GET_POPULAR_MOVIES,
    {
      variables: searchQuery ? { query: searchQuery } : undefined,
    }
  );

  if (loading) return <MovieGridSkeleton />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive text-lg">Error: {error.message}</p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );

  let movies: Movie[] = searchQuery ? data?.searchMovies : data?.popularMovies;

  // Sort movies based on selected criteria
  if (movies) {
    movies = [...movies].sort((a, b) => {
      if (sortBy === "rating") {
        return b.voteAverage - a.voteAverage;
      }
      return a.title.localeCompare(b.title);
    });
  }

  if (!movies?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-semibold">No movies found</p>
        <p className="text-muted-foreground">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={sortBy}
          onValueChange={(value: "rating" | "title") => setSortBy(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Sort by Rating</SelectItem>
            <SelectItem value="title">Sort by Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/movie/${movie.id}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-0 aspect-[2/3] relative">
                  {movie.posterPath ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={movie.posterPath}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No poster available
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 p-4">
                  <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {movie.overview}
                  </p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{movie.voteAverage.toFixed(1)}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MovieGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardContent className="p-0">
              <Skeleton className="w-full aspect-[2/3]" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
