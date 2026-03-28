import { UseQueryOptions } from "@tanstack/react-query";

// UseQuery configuration type without queryKey and queryFn
export type QueryConfig = Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'>;

// For data that changes frequently and needs immediate consistency (e.g., seats, orders, showtimes, comments)
export const hotOption: QueryConfig = {
    staleTime: 30 * 1000, // 30s (data thay đổi liên tục)
    gcTime: 5 * 60 * 1000, // 5 phút
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
}

// Data thay đổi vừa phải
export const warmOption: QueryConfig = {
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 15 * 60 * 1000, // 15 phút
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
}

// Data gần như static
export const coldOption: QueryConfig = {
    staleTime: 60 * 60 * 1000, // 1 giờ
    gcTime: 24 * 60 * 60 * 1000, // 24 giờ
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
}