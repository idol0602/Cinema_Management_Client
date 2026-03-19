import { movieService } from '../services/movie.service';
import type { MovieType } from '../types/movie.type';
import type { PaginationQuery, PaginatedResponse, PaginationMeta } from '../types/pagination.type';
import { useQuery } from '@tanstack/react-query';
import { warmOption } from './option';

interface UseNowShowingMoviesOptions extends PaginationQuery {
  initialData?: MovieType[];
  metaData?: PaginationMeta;
}

export const useNowShowingMovies = (options: UseNowShowingMoviesOptions) => {
  const { page, limit, sortBy, search, searchBy, filter, initialData, metaData } = options;

  return useQuery<PaginatedResponse<MovieType>>({
    queryKey: [
      'nowShowingMovies',
      page,
      limit,
      sortBy,
      search,
      searchBy,
      JSON.stringify(filter ?? {}),
    ],
    queryFn: async () => {
      return await movieService.findNowShowing({ page, limit, sortBy, search, searchBy, filter });
    },
    initialData: initialData
      ? ({
          data: initialData,
          success: true,
          error: '',
          meta: metaData || {
            itemsPerPage: limit || 10,
            totalItems: initialData.length,
            currentPage: page || 1,
            totalPages: Math.ceil(initialData.length / (limit || 10)),
          },
          links: {
            current: `?page=${page || 1}&limit=${limit || 10}`,
          },
        } as PaginatedResponse<MovieType>)
      : undefined,
    ...warmOption,
  });
};
