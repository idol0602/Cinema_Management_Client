import { movieTypeService } from "@/services/movieType.service"
import type { MovieTypeType } from "@/types/movieType.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseMovieTypesOptions {
  initialData?: MovieTypeType[]
}

export const useMovieTypes = (options: UseMovieTypesOptions = {}) => {
  return useQuery<MovieTypeType[]>({
    queryKey: ["movieTypes"],
    queryFn: async () => {
      const response = await movieTypeService.findAll()
      return response.data as MovieTypeType[]
    },
    initialData: options.initialData,
    ...defaultOption,
  })
}
