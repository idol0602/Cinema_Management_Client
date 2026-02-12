export interface MovieType {
    id?: string,
    title: string,
    director: string,
    country: string,
    description: string,
    release_date?: string,
    duration?: number,
    rating?: number,
    image?: string,
    thumbnail?: string,
    trailer?: string,
    movie_type_id: string, // Reference to movie_types table
    is_active?: boolean,
    created_at?: string,
}

export interface CreateMovieType {
    title: string,
    director: string,
    country: string,
    description: string,
    release_date?: string,
    duration?: number,
    rating?: number,
    image?: string,
    thumbnail?: string,
    trailer?: string,
    movie_type_id: string, // Reference to movie_types table
    is_active?: boolean,
    created_at?: string,
}

export interface UpdateMovieType {
    title?: string,
    director?: string,
    country?: string,
    description?: string,
    release_date?: string,
    duration?: number,
    rating?: number,
    image?: string,
    thumbnail?: string,
    trailer?: string,
    movie_type_id?: string, // Reference to movie_types table
    is_active?: boolean,
    created_at?: string,
}