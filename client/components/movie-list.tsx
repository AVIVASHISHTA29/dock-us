"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const { loading, error, data } = useQuery(
    searchQuery ? SEARCH_MOVIES : GET_POPULAR_MOVIES,
    {
      variables: searchQuery ? { query: searchQuery } : undefined,
    }
  );

  if (loading) return <MovieGridSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  const movies: Movie[] = searchQuery
    ? data?.searchMovies
    : data?.popularMovies;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies?.map((movie: Movie) => (
        <Link href={`/movie/${movie.id}`} key={movie.id}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardContent className="p-0 aspect-[2/3] relative">
              {movie.posterPath ? (
                <Image
                  src={movie.posterPath}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  No poster available
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 p-4">
              <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {movie.overview}
              </p>
              <div className="text-sm">
                Rating: {movie.voteAverage.toFixed(1)}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function MovieGridSkeleton() {
  return (
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
  );
}
