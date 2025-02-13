import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, movie } = await req.json();
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are a movie expert, your job is to answer questions about the movie ${
          movie.title
        } - Here's the entire movie object - for your reference: ${JSON.stringify(
          movie
        )}`,
      },
      ...messages,
    ],
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
