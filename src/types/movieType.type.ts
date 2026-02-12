export interface MovieTypeType {
    id?: string,
    name?: string,
    type: string,
    is_active?: boolean,
    created_at?: string,
}

export interface CreateMovieTypeType {
    type: string,
    is_active?: boolean,
    created_at?: string,
}

export interface UpdateMovieTypeType {
    type?: string,
    is_active?: boolean,
}