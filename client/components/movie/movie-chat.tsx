"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Movie } from "@/types/movie";
import { useChat } from "ai/react";
import { Send } from "lucide-react";

export default function MovieChat({ movie }: { movie: Movie }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    // addToolResult,
    // isLoading,
    // setInput,
    // reload,
    // setMessages,
  } = useChat({
    api: "/api/chat",
    body: {
      movie,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (
    <div className="container mx-auto max-w-4xl p-4 h-[calc(100vh-4rem)]">
      <Card className="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                  {message.content}
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
