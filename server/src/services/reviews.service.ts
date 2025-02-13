import { createClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";
import { Review } from "../types/index.js";

export class ReviewsService {
  private static supabase = createClient(
    config.supabase.url!,
    config.supabase.key!
  );

  static async createReview(movieId: number, content: string): Promise<Review> {
    const { data, error } = await this.supabase
      .from("reviews")
      .insert({
        movieId,
        content,
      })
      .select()
      .single();

    if (error) {
      throw new Error("Failed to create review");
    }

    if (!data) {
      throw new Error("Failed to create review");
    }

    return data;
  }

  static async getReviewsByMovieId(movieId: number): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("movieId", movieId)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Failed to get reviews", error);
      throw new Error("Failed to get reviews");
    }

    if (!data) {
      throw new Error("Failed to get reviews");
    }

    return data;
  }
}
