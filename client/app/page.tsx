"use client";

import { HeaderSkeleton } from "@/components/skeletons/header-skeleton";
import { MovieListSkeleton } from "@/components/skeletons/movie-list-skeleton";
import { SearchBarSkeleton } from "@/components/skeletons/search-bar-skeleton";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const SearchBar = dynamic(() => import("@/components/common/search-bar"), {
  ssr: false,
  loading: () => <SearchBarSkeleton />,
});

const MovieList = dynamic(() => import("@/components/home/movie-list"), {
  ssr: false,
  loading: () => <MovieListSkeleton />,
});

function Header() {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">Movie Explorer</h1>
      <p className="text-muted-foreground">
        Discover and review your favorite movies
      </p>
    </div>
  );
}

function PageContent() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Header />
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
            <HeaderSkeleton />
            <Skeleton className="h-px w-full" />
            <SearchBarSkeleton />
            <MovieListSkeleton />
          </div>
        }
      >
        <PageContent />
      </Suspense>
    </main>
  );
}
