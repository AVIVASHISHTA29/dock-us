"use client";
import MovieList from "@/components/movie-list";
import SearchBar from "@/components/search-bar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function PageContent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Movie Explorer</h1>
        <p className="text-muted-foreground">
          Discover and review your favorite movies
        </p>
      </div>
      <Separator />
      <SearchBar />
      <MovieList />
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="w-full max-w-xl mx-auto mb-8">
              <Skeleton className="w-full h-10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3]" />
              ))}
            </div>
          </div>
        }
      >
        <PageContent />
      </Suspense>
    </main>
  );
}
