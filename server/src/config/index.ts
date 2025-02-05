import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
  tmdb: {
    apiKey: process.env.TMDB_API_KEY || "",
    baseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    imageBaseUrl: "https://image.tmdb.org/t/p/w500",
  },
  server: {
    port: process.env.PORT || 4000,
  },
  redis: process.env.REDIS_KEY,
} as const;
