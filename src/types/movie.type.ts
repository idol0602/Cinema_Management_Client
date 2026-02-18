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
    is_active?: boolean,
    created_at?: string,
}

export interface createMovieWithTypes {
    movie: CreateMovieType,
    movieTypes: string[]
}

export interface updateMovieWithTypes {
    movie: UpdateMovieType,
    movieTypes: string[]
}
