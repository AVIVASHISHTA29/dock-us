"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GET_POPULAR_MOVIES, SEARCH_MOVIES } from "@/graphql/movie";
import { PopularMoviesResponse, SearchMoviesResponse } from "@/types/movie";
import { useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieGridSkeleton } from "../skeletons/movie-grid-skeleton";

function PaginationComponent({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}) {
  const goBack = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goForward = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const currentGroup = Math.floor((page - 1) / 5);
  const startPage = currentGroup * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  return (
    <div className="flex w-full">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={goBack}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href="#" onClick={() => setPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationLink href="#" className="pointer-events-none">
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((pageNum) => (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={() => setPage(pageNum)}
                isActive={pageNum === page}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink href="#" className="pointer-events-none">
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href="#" onClick={() => setPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={goForward}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default function MovieList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const { loading, error, data } = useQuery<
    SearchMoviesResponse | PopularMoviesResponse
  >(searchQuery ? SEARCH_MOVIES : GET_POPULAR_MOVIES, {
    variables: searchQuery ? { query: searchQuery, page } : { page },
  });

  if (loading) return <MovieGridSkeleton />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-destructive text-lg">Error: {error.message}</p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );

  const { results: movies, totalPages } = searchQuery
    ? (data as SearchMoviesResponse)?.searchMovies
    : (data as PopularMoviesResponse)?.popularMovies;

  // Sort movies based on selected criteria
  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === "rating") {
      return b.voteAverage - a.voteAverage;
    }
    return a.title.localeCompare(b.title);
  });

  if (!sortedMovies?.length) {
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
      <div className="flex justify-between w-full items-center">
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
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
        {sortedMovies.map((movie, index) => (
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
