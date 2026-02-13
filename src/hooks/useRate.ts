import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rateService } from "@/services/rate.service"
import type { CreateRateType, UpdateRateType } from "@/types/rate.type"
import { defaultOption } from "./option"

interface UseRateOptions {
  userId?: string
  movieId?: string
}

export const useRate = ({ userId, movieId }: UseRateOptions = {}) => {
  const queryClient = useQueryClient()
  const baseKey = ["rates"]
  
  // Query to get user's rating for specific movie
  const userRateQuery = useQuery({
    queryKey: [...baseKey, "user", userId, "movie", movieId],
    queryFn: async () => {
      if (!userId || !movieId) return null
      
      const response = await rateService.findAndPaginate({
         page: 1,
         limit: 1,
         filter: {
            user_id: userId,
            movie_id: movieId
         }
      })
      
      if (!response.success) throw new Error(response.error)
      
      return response.data[0] || null
    },
    enabled: !!userId && !!movieId,
    ...defaultOption
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: CreateRateType) => {
      const response = await rateService.create(data)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey })
      // Also invalidate movies query to update average rating if needed
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRateType }) => {
      const response = await rateService.update(id, data)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey })
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await rateService.delete(id)
      if (!response.success) throw new Error(response.error)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: baseKey })
      queryClient.invalidateQueries({ queryKey: ["movies"] })
    }
  })

  return {
    userRate: userRateQuery.data,
    isLoadingUserRate: userRateQuery.isLoading,
    
    createRate: createMutation.mutateAsync,
    updateRate: updateMutation.mutateAsync,
    deleteRate: deleteMutation.mutateAsync,
    
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
