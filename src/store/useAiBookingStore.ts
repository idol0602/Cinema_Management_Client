import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SelectedMenuItem {
  id: string
  quantity: number
}

interface AiBookingState {
  // Booking selections
  movieId: string | null
  showTimeId: string | null
  showTimeSeatIds: string[]
  comboIds: string[]
  menuItems: SelectedMenuItem[]
  eventId: string | null
  paymentMethod: string

  // Current step tracking
  currentStep: number

  // Actions
  setMovieId: (id: string | null) => void
  setShowTimeId: (id: string | null) => void
  setShowTimeSeatIds: (ids: string[]) => void
  addShowTimeSeatId: (id: string) => void
  removeShowTimeSeatId: (id: string) => void
  setComboIds: (ids: string[]) => void
  addComboId: (id: string) => void
  removeComboId: (id: string) => void
  setMenuItems: (items: SelectedMenuItem[]) => void
  updateMenuItemQuantity: (id: string, quantity: number) => void
  removeMenuItem: (id: string) => void
  setEventId: (id: string | null) => void
  setPaymentMethod: (method: string) => void
  setCurrentStep: (step: number) => void
  resetAll: () => void
}

const initialState = {
  movieId: null,
  showTimeId: null,
  showTimeSeatIds: [],
  comboIds: [],
  menuItems: [],
  eventId: null,
  paymentMethod: '',
  currentStep: 0,
}

export const useAiBookingStore = create<AiBookingState>()(
  devtools(
    (set) => ({
      ...initialState,

      setMovieId: (id) => set({ movieId: id }),
      setShowTimeId: (id) => set({ showTimeId: id }),

      setShowTimeSeatIds: (ids) => set({ showTimeSeatIds: ids }),
      addShowTimeSeatId: (id) =>
        set((state) => ({
          showTimeSeatIds: state.showTimeSeatIds.includes(id)
            ? state.showTimeSeatIds
            : [...state.showTimeSeatIds, id],
        })),
      removeShowTimeSeatId: (id) =>
        set((state) => ({
          showTimeSeatIds: state.showTimeSeatIds.filter((sId) => sId !== id),
        })),

      setComboIds: (ids) => set({ comboIds: ids }),
      addComboId: (id) =>
        set((state) => ({
          comboIds: state.comboIds.includes(id)
            ? state.comboIds
            : [...state.comboIds, id],
        })),
      removeComboId: (id) =>
        set((state) => ({
          comboIds: state.comboIds.filter((cId) => cId !== id),
        })),

      setMenuItems: (items) => set({ menuItems: items }),
      updateMenuItemQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { menuItems: state.menuItems.filter((m) => m.id !== id) }
          }
          const exists = state.menuItems.find((m) => m.id === id)
          if (exists) {
            return {
              menuItems: state.menuItems.map((m) =>
                m.id === id ? { ...m, quantity } : m
              ),
            }
          }
          return { menuItems: [...state.menuItems, { id, quantity }] }
        }),
      removeMenuItem: (id) =>
        set((state) => ({
          menuItems: state.menuItems.filter((m) => m.id !== id),
        })),

      setEventId: (id) => set({ eventId: id }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetAll: () => set(initialState),
    }),
    { name: 'ai-booking-store' }
  )
)
