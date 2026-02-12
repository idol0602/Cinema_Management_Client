import { slideService } from "@/services/slide.service"
import type { SlideType } from "@/types/slide.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseSlidesOptions {
  initialData?: SlideType[]
}

export const useSlides = (options: UseSlidesOptions = {}) => {
  return useQuery<SlideType[]>({
    queryKey: ["slides"],
    queryFn: async () => {
      const response = await slideService.getAll()
      return (response.data as SlideType[]).filter((slide: SlideType) => slide.is_active)
    },
    initialData: options.initialData,
    ...defaultOption,
  })
}
