import { z } from "zod";

export const createMovieMovieTypeSchema = z.object({
  movie_id: z.string({ message: "ID phim là bắt buộc" }).min(1, "ID phim không được để trống"),
  movie_type_id: z.string({ message: "ID thể loại phim là bắt buộc" }).min(1, "ID thể loại phim không được để trống"),
});

export const updateMovieMovieTypeSchema = createMovieMovieTypeSchema.partial();
