import { roomService } from "@/services/room.service"
import type { RoomType } from "@/types/room.type"
import { useQuery } from "@tanstack/react-query"
import { defaultOption } from "./option"

export const useRooms = () => {
  return useQuery<RoomType[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await roomService.getAll()
      return response.data as RoomType[]
    },
    ...defaultOption,
  })
}
