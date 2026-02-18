export interface MovieMovieType {
    id: string,
    movie_id: string,
    movie_type_id: string
}

export interface CreateMovieMovieType {
    movie_id: string,
    movie_type_id: string
}

export interface UpdateMovieMovieType {
    movie_id?: string,
    movie_type_id?: string
}