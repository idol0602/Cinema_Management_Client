import {movieService} from "../services/movie.service"
import type {MovieType} from "../types/movie.type"
import type {PaginationQuery, PaginatedResponse} from "../types/pagination.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseMoviesOptions extends PaginationQuery {
  initialData?: MovieType[]
}

export const useMovies = (options: UseMoviesOptions) => {
    const {
    page,
    limit,
    sortBy,
    search,
    searchBy,
    filter,
    initialData,
  } = options
    return useQuery<PaginatedResponse<MovieType>>({
        queryKey: ["movies", page, limit, sortBy, search, searchBy, JSON.stringify(filter ?? {})],
        queryFn: async () => {
            const response = await movieService.findAndPaginate({ page, limit, sortBy, search, searchBy, filter })
            return response as PaginatedResponse<MovieType>
        },
        initialData: initialData ? { 
            data: initialData, 
            success: true, 
            error: "",
            meta: {
                itemsPerPage: limit || 10,
                totalItems: initialData.length,
                currentPage: page || 1,
                totalPages: Math.ceil(initialData.length / (limit || 10))
            },
            links: {
                current: `?page=${page || 1}&limit=${limit || 10}`
            }
        } as PaginatedResponse<MovieType> : undefined,
        ...defaultOption,
    })
}