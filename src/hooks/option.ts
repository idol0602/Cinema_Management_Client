import { UseQueryOptions } from "@tanstack/react-query";

// UseQuery configuration type without queryKey and queryFn
export type QueryConfig = Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>;

// For data that changes frequently and needs immediate consistency (e.g., seats, orders, showtimes, comments)
export const hotOption: QueryConfig = {
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
}

// For data that changes occasionally (e.g., movies, events, combos, posts)
export const warmOption: QueryConfig = {
    staleTime: 0, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
}

// For data that rarely changes (e.g., locations, rooms, ticket prices, movie types)
export const coldOption: QueryConfig = {
    staleTime: 0, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
}