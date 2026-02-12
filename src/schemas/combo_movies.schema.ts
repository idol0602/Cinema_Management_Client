import { z } from "zod";

export const createComboMovieSchema = z.object({
  combo_id: z.string().min(1, "ID combo là bắt buộc"),
  movie_id: z.string().min(1, "ID phim là bắt buộc"),
});

export const updateComboMovieSchema = createComboMovieSchema.partial();
