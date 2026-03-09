import { eventTypeService } from "../services/eventType.service"
import type { EventTypeType } from "../types/eventType.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

interface UseEventTypesOptions {
  initialData?: EventTypeType[]
}

export const useEventTypes = (options?: UseEventTypesOptions) => {
  return useQuery<EventTypeType[]>({
    queryKey: ["eventTypes"],
    queryFn: async () => {
      const response = await eventTypeService.getAll()
      if (response.success && response.data) {
        return response.data as EventTypeType[]
      }
      return []
    },
    initialData: options?.initialData,
    ...defaultOption,
  })
}
