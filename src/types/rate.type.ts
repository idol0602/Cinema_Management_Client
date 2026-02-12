export interface RateType {
  id?: string;
  movie_id: string;
  user_id: string;
  stars: number;
  created_at?: string;
}

export interface CreateRateType {
  movie_id: string;
  user_id: string;
  stars: number;
  created_at?: string;
}

export interface UpdateRateType {
  movie_id?: string;
  user_id?: string;
  stars?: number;
  created_at?: string;
}