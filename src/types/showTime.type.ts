import type { MovieType } from "./movie.type";
import type { RoomType } from "./room.type";
export type DayType = "WEEKDAY" | "WEEKEND";

export interface ShowTimeType {
  id?: string;
  movie_id: string;
  room_id: string;
  start_time: string;
  end_time?: string;
  day_type: DayType;
  is_active?: boolean;
  created_at?: string;
  movies: MovieType;
  rooms: RoomType;
}

export interface CreateShowTimeType {
  movie_id: string;
  room_id: string;
  start_time: string;
  end_time?: string;
  day_type: DayType;
  is_active?: boolean;
  created_at?: string;
}

export interface UpdateShowTimeType {
  movie_id?: string;
  room_id?: string;
  start_time?: string;
  end_time?: string;
  day_type?: DayType;
  is_active?: boolean;
  created_at?: string;
}

// Types for ShowTime Detail API response
export interface MovieTypeDetail {
  id: string;
  type: string;
}

export interface ShowTimeDetailMovie {
  id: string;
  title: string;
  director: string;
  country: string;
  description: string;
  release_date: string;
  duration: number;
  rating: number;
  image: string;
  thumbnail: string;
  trailer: string;
  movie_type: MovieTypeDetail;
}

export interface FormatDetail {
  id: string;
  name: string;
}

export interface SeatTypeDetail {
  id: string;
  name: string;
  type?: string;
  price?: number;
}

export interface ShowTimeSeatDetail {
  id: string;
  status_seat: "AVAILABLE" | "HOLDING" | "BOOKED" | "FIXING";
  price?: number;
}

export interface SeatDetail {
  id: string;
  seat_number: string;
  is_active: boolean;
  seat_type: SeatTypeDetail;
  show_time_seat: ShowTimeSeatDetail | null;
}

export interface RoomDetail {
  id: string;
  name: string;
  location: string;
  format: FormatDetail;
  seats: SeatDetail[];
}

export interface ShowTimeDetailType {
  id: string;
  start_time: string;
  end_time: string;
  day_type: DayType;
  is_active: boolean;
  created_at: string;
  movie: ShowTimeDetailMovie;
  room: RoomDetail;
}