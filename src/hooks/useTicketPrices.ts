import { ticketPriceService } from '../services/ticketPrice.service';
import type { TicketPriceType } from '../types/ticketPrice.type';
import type { PaginationQuery, PaginatedResponse, PaginationMeta } from '../types/pagination.type';
import { useQuery } from '@tanstack/react-query';
import { coldOption } from './option';

interface UseTicketPricesOptions extends PaginationQuery {
  initialData?: TicketPriceType[];
  metaData?: PaginationMeta;
}

export const useTicketPrices = (options: UseTicketPricesOptions) => {
  const { page, limit, sortBy, search, searchBy, filter, initialData, metaData } = options;

  // Always force is_active: true for customer-facing
  const finalFilter = { ...filter, is_active: 'true' };

  return useQuery<PaginatedResponse<TicketPriceType>>({
    queryKey: ['ticketPrices', page, limit, sortBy, search, searchBy, JSON.stringify(finalFilter)],
    queryFn: async () => {
      const response = await ticketPriceService.findAndPaginate({
        page,
        limit,
        sortBy,
        search,
        searchBy,
        filter: finalFilter,
      });
      return response as PaginatedResponse<TicketPriceType>;
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
        } as PaginatedResponse<TicketPriceType>)
      : undefined,
    ...coldOption,
  });
};
