import api, { handleApiError } from "./api";
import type {loginType, authResponse} from "@/types/auth.type.ts"
import type { User } from "@/types/user.type.ts";

export const authService = {
    login: async(payload : loginType) : Promise<authResponse> => {
        try {
            const response = await api.post("/auth/login", payload);
            return {
                data: response.data.data,
                error: null
            };
        } catch (error) {
            const apiError = handleApiError(error);
            return {
                data: {
                    user: {
                        name: "",
                        email: "",
                        phone: "",
                        role: "",
                        is_active: false,
                        created_at: ""
                    }
                },
                error: apiError.message
            };
        }
    },
    forgotPassword: async(email: string): Promise<{success: boolean, message: string, error: string | null}> => {
        try {
            const response = await api.post("/auth/forgot-password", { email });
            return {
                success: response.data.success,
                message: response.data.message,
                error: null
            };
        } catch (error) {
            const apiError = handleApiError(error);
            return {
                success: false,
                message: "",
                error: apiError.message
            };
        }
    },
    resetPassword: async(token: string, newPassword: string): Promise<{success: boolean, message: string, error: string | null}> => {
        try {
            const response = await api.post("/auth/reset-password", { token, newPassword });
            return {
                success: response.data.success,
                message: response.data.message,
                error: null
            };
        } catch (error) {
            const apiError = handleApiError(error);
            return {
                success: false,
                message: "",
                error: apiError.message
            };
        }
    },
    updateProfile: async(userId: string, updatedData: Partial<User>) : Promise<authResponse> => {
        try {
            const response = await api.put(`/auth/update-profile/${userId}`, updatedData);
            return {
                data: response.data.data,
                error: null
            };
        } catch (error) {
            const apiError = handleApiError(error);
            return {
                data: {
                    user: {
                        name: "",
                        email: "",
                        phone: "",
                        role: "",
                        is_active: false,
                        created_at: ""
                    }
                },
                error: apiError.message
            };
        }
    },
    logout: async(): Promise<{success: boolean, message: string, error: string | null}> => {
        try {
            const response = await api.post("/auth/logout");
            return {
                success: response.data.success,
                message: response.data.message,
                error: null
            };
        } catch (error) {
            const apiError = handleApiError(error);
            return {
                success: false,
                message: "",
                error: apiError.message
            };
        }
    }
    
}