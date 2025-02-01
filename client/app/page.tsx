import MovieList from "@/components/movie-list";
import { SearchBar } from "@/components/search-bar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
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
    </main>
  );
}
