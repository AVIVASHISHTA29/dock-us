"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Movie, SimilarMovie } from "@/types/movie";
import { useChat } from "ai/react";
import { CalendarDays, Send, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "../common/readme-render";

export default function MovieChat({ movie }: { movie: Movie }) {
  const router = useRouter();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    body: {
      movie,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleMovieClick = (movieId: number) => {
    // Navigate to search results page with the movie title
    router.push(`/movie/${movieId}`);
  };

  return (
    <div className="w-full py-4 h-[calc(100vh-4rem)] flex flex-col gap-4 border-t mt-6">
      <h1 className="text-2xl font-bold text-left">
        Chat AI For {movie.title}
      </h1>
      <Card className="w-full flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ScrollArea className="flex-1 p-4 h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%] break-words",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    <>
                      {message.parts?.map((part, index) => {
                        if ("text" in part) {
                          return (
                            <MarkdownRenderer key={index} content={part.text} />
                          );
                        }
                        if ("toolInvocation" in part) {
                          const toolCall = part.toolInvocation;
                          if (toolCall.toolName === "getSimilarMovies") {
                            switch (toolCall.state) {
                              case "call":
                                return (
                                  <div
                                    key={index}
                                    className="text-muted-foreground"
                                  >
                                    Fetching similar movies...
                                  </div>
                                );
                              case "result":
                                try {
                                  const movies = JSON.parse(
                                    toolCall.result
                                  ) as SimilarMovie[];
                                  return (
                                    <div key={index} className="space-y-4">
                                      <p className="font-medium text-lg">
                                        Similar Movies:
                                      </p>
                                      <div className="grid grid-cols-1 gap-4">
                                        {movies.map((m, i) => (
                                          <div
                                            key={i}
                                            onClick={() =>
                                              handleMovieClick(m.id)
                                            }
                                            className="group relative overflow-hidden rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                                          >
                                            <div className="p-4">
                                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                {m.title}
                                              </h3>
                                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <CalendarDays className="h-4 w-4" />
                                                <span>
                                                  {new Date(
                                                    m.releaseDate
                                                  ).getFullYear()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                  {m.rating.toFixed(1)}
                                                </span>
                                              </div>
                                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {m.overview}
                                              </p>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                } catch {
                                  return (
                                    <span key={index}>{toolCall.result}</span>
                                  );
                                }
                            }
                          }
                        }
                        return null;
                      })}
                      {!message.parts && message.content && (
                        <MarkdownRenderer content={message.content} />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-4 border-t"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
