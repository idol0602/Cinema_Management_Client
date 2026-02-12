export interface ComboMovieType {
  id?: string;
  combo_id: string;
  movie_id: string;
}

export interface CreateComboMovieType {
  combo_id: string;
  movie_id: string;
}

export interface UpdateComboMovieType {
  combo_id?: string;
  movie_id?: string;
}