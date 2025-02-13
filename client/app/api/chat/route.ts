import { SimilarMovie } from "@/types/movie";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";

// Set max duration for streaming responses
export const maxDuration = 30;

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

async function getSimilarMovies(movieId: number): Promise<SimilarMovie[]> {
  console.log("Fetching similar movies for movie ID:", movieId);
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TMDB_API_KEY!.trim()}`,
      },
    }
  );
  const data = await response.json();
  return data.results.slice(0, 5).map((movie: TMDBMovie) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    releaseDate: movie.release_date,
    rating: movie.vote_average,
  }));
}

export async function POST(req: NextRequest) {
  const { messages, movie } = await req.json();

  const result = streamText({
    toolCallStreaming: true,
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are a movie expert, your job is to answer questions about the movie ${
          movie.title
        } - Here's the entire movie object - for your reference: ${JSON.stringify(
          movie
        )}. You can also suggest similar movies when asked.`,
      },
      ...messages,
    ],
    tools: {
      getSimilarMovies: {
        description: "Get similar movie suggestions based on the current movie",
        parameters: z.object({
          movieId: z
            .number()
            .describe(
              "The TMDB ID of the movie to get similar suggestions for"
            ),
        }),
        execute: async ({ movieId }: { movieId: number }) => {
          try {
            const similarMovies = await getSimilarMovies(movieId);
            return JSON.stringify(similarMovies);
          } catch (error) {
            console.error("Error fetching similar movies:", error);
            return "Sorry, I couldn't fetch similar movies at the moment.";
          }
        },
      },
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
