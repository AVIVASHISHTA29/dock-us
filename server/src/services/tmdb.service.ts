import fetch from "node-fetch";
import { config } from "../config/index.js";
import { TMDBMovieDetails, TMDBResponse } from "../types/index.js";

export class TMDBService {
  private static headers = {
    accept: "application/json",
    Authorization: `Bearer ${config.tmdb.apiKey.trim()}`,
  };

  static async getPopularMovies() {
    try {
      if (!config.tmdb.apiKey) {
        console.error("TMDB_API_KEY is not set in environment variables");
        return [];
      }

      const response = await fetch(
        `${config.tmdb.baseUrl}/discover/movie?language=en-US&page=1&sort_by=popularity.desc`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as TMDBResponse;
      return data.results;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return [];
    }
  }

  static async searchMovies(query: string) {
    try {
      if (!config.tmdb.apiKey) {
        console.error("TMDB_API_KEY is not set in environment variables");
        return [];
      }

      const response = await fetch(
        `${
          config.tmdb.baseUrl
        }/search/movie?language=en-US&query=${encodeURIComponent(
          query
        )}&page=1`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as TMDBResponse;
      return data.results;
    } catch (error) {
      console.error("Error searching movies:", error);
      return [];
    }
  }

  static async getMovieById(id: number) {
    try {
      if (!config.tmdb.apiKey) {
        console.error("TMDB_API_KEY is not set in environment variables");
        return null;
      }

      const response = await fetch(
        `${config.tmdb.baseUrl}/movie/${id}?language=en-US`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const movie = (await response.json()) as TMDBMovieDetails;

      if (movie.status_code === 34) {
        return null;
      }

      return movie;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  }
}
