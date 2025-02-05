import fetch from "node-fetch";
import { config } from "../config/index.js";

import { client } from "../index.js";
import { TMDBMovieDetails, TMDBResponse } from "../types/index.js";

export class TMDBService {
  private static headers = {
    accept: "application/json",
    Authorization: `Bearer ${config.tmdb.apiKey.trim()}`,
  };

  static async getPopularMovies(page: number) {
    try {
      if (!config.tmdb.apiKey) {
        console.error("TMDB_API_KEY is not set in environment variables");
        return [];
      }

      const popularMovies = await client.get(`popular-movies-${page}`);

      if (popularMovies) {
        const data = popularMovies as any as TMDBResponse;
        return JSON.parse(data.results as any);
      } else {
        const response = await fetch(
          `${config.tmdb.baseUrl}/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc`,
          { headers: this.headers }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as TMDBResponse;
        await client.set(
          `popular-movies-${page}`,
          JSON.stringify(data.results),
          {
            EX: 60,
            NX: true,
          }
        );
        return data.results;
      }
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      return [];
    }
  }

  static async searchMovies(query: string, page: number) {
    try {
      if (!config.tmdb.apiKey) {
        console.error("TMDB_API_KEY is not set in environment variables");
        return [];
      }

      const searchMovies = await client.get(`search-movies-${query}-${page}`);

      if (searchMovies) {
        return JSON.parse(searchMovies as any);
      }

      const response = await fetch(
        `${
          config.tmdb.baseUrl
        }/search/movie?language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}`,
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as TMDBResponse;
      await client.set(
        `search-movies-${query}-${page}`,
        JSON.stringify(data.results),
        {
          EX: 60,
          NX: true,
        }
      );
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

      const movieFromCache = await client.get(`movie-${id}`);

      if (movieFromCache) {
        return JSON.parse(movieFromCache as any);
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

      await client.set(`movie-${id}`, JSON.stringify(movie), {
        EX: 60,
        NX: true,
      });

      return movie;
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  }
}
