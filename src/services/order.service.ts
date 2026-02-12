import api, { handleApiError } from "./api"
import type {serviceResponse} from "../types/api.type"
import type {PaginationQuery, PaginatedResponse} from "@/types/pagination.type"
import type { CreateOrderType, UpdateOrderType,OrderType } from "@/types/order.type"

export const orderService = {
  getAll: async () : Promise<serviceResponse> => {
    try {
      const response = await api.get('/orders/all')
      return {
        data: response.data.data,
        success : true,
        error: response.data.error
      }
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data:[],
        success: false,
        error: apiError.message
      }
    }
  },

  getById: async (id: string) : Promise<serviceResponse> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return {
        data: response.data.data,
        success : true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success : false,
        error: apiError.message
      }
    }
  },

  create: async (data: CreateOrderType) : Promise<serviceResponse> => {
    try {
      const response = await api.post('/orders', data);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },

  update: async (id: string, data: UpdateOrderType) : Promise<serviceResponse>  => {
    try {
      const response = await api.put(`/orders/${id}`, data);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },

  delete: async (id: string) : Promise<serviceResponse> => {
    try {
      await api.delete(`/orders/${id}`);
      return {
        data: {},
        success: true,
        error: ""
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: {},
        success: false,
        error: apiError.message,
      };
    }
  },

  findAndPaginate: async(query: PaginationQuery): Promise<PaginatedResponse<OrderType>> => {
    try {
      const response = await api.get("/orders", { params: query });
      return {
            data: response.data.data,
            success: true,
            error: response.data.error || "",
            meta: response.data.meta,
            links: response.data.links
        };
    } catch (error) {
      const apiError = handleApiError(error);
       return {
            data: [],
            success: false,
            error: apiError.message
        };
    }
  },

  getOrderDetails: async (id: string): Promise<serviceResponse> => {
    try {
      const response = await api.get(`/orders/detail/${id}`);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: null,
        success: false,
        error: apiError.message,
      };
    }
  },

  processOrderPayment: async (payload: {
    order: any;
    tickets: any[];
    comboItemInTickets: any[];
    menuItemInTickets: any[];
    showTime: any;
  }): Promise<serviceResponse> => {
    try {
      const response = await api.post('/orders/process', payload);
      return {
        data: response.data.data,
        success: true,
        error: response.data.error,
      };
    } catch (error) {
      const apiError = handleApiError(error);
      return {
        data: null,
        success: false,
        error: apiError.message,
      };
    }
  },
}

/**
 * Validate booking time - check if showtime hasn't passed
 * @param startTime - Showtime start time (ISO string)
 * @param cutoffMinutes - Minutes before showtime to cutoff booking (default: 5)
 * @returns Object with valid status and message
 */
export const validateBookingTime = (
  startTime: string,
  cutoffMinutes: number = 5
): { valid: boolean; message: string; remainingMinutes: number } => {
  const showStart = new Date(startTime);
  const now = new Date();
  const cutoffTime = new Date(showStart.getTime() - cutoffMinutes * 60 * 1000);

  const remainingMs = cutoffTime.getTime() - now.getTime();
  const remainingMinutes = Math.floor(remainingMs / (60 * 1000));

  if (now >= cutoffTime) {
    return {
      valid: false,
      message: `Đã quá thời gian đặt vé. Chỉ có thể đặt vé trước ${cutoffMinutes} phút so với giờ chiếu.`,
      remainingMinutes: 0,
    };
  }

  return {
    valid: true,
    message: `Còn ${remainingMinutes} phút để hoàn tất đặt vé`,
    remainingMinutes,
  };
};
