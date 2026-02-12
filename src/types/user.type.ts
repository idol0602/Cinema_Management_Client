export interface User {
    id?: string;
    name: string,
    email: string,
    phone?: string,
    password?: string,
    avatar?: string,
    role: string,
    is_active?: boolean,
    is_online?: boolean,
    last_seen?: string,
    created_at?: string,
}

export interface CreateUserType {
    name: string,
    email: string,
    phone?: string,
    password: string,
    role?: string,
    is_active?: boolean,
    is_online?: boolean,
    last_seen?: string,
    created_at?: string
}

export interface UpdateUserType {
    name?: string,
    email?: string,
    phone?: string,
    password?: string,
    role?: string,
    is_active?: boolean,
    is_online?: boolean,
    last_seen?: string,
    created_at?: string
}