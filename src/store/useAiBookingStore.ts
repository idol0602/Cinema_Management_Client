import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PaginationMeta } from '@/types/pagination.type'
import { toast } from 'sonner'
import { aiBookingService } from '@/services/ai_booking.service'
import { orderService } from '@/services/order.service'
import { PaymentMethod } from '@/types/paymentMethos.type'
import type { OrderType, PaymentUrlResponseData } from '@/types/order.type'
import { useAuthStore } from './useAuthStore'

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

  // AI chat-driven state
  activeAction: string | null
  chatData: any
  chatMeta: PaginationMeta | null
  isAiLoading: boolean

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
  setActiveAction: (action: string | null) => void
  setChatData: (data: any) => void
  setChatMeta: (meta: PaginationMeta | null) => void
  setIsAiLoading: (loading: boolean) => void
  createOrder: () => Promise<OrderType | null>
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
  activeAction: null,
  chatData: null,
  chatMeta: null,
  isAiLoading: false,
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
      setActiveAction: (action) => set({ activeAction: action }),
      setChatData: (data) => set({ chatData: data }),
      setChatMeta: (meta) => set({ chatMeta: meta }),
      setIsAiLoading: (loading) => set({ isAiLoading: loading }),
      createOrder: async () => {
        try {
          const state = useAiBookingStore.getState()
          const userId = useAuthStore.getState().user?.id

          // Validate minimal booking data before creating AI order
          if (!state.movieId) {
            toast.error('Vui lòng chọn phim')
            return null
          }
          if (!state.showTimeId) {
            toast.error('Vui lòng chọn suất chiếu')
            return null
          }
          if (!state.showTimeSeatIds || state.showTimeSeatIds.length === 0) {
            toast.error('Vui lòng chọn ít nhất một ghế')
            return null
          }
          if (!state.paymentMethod) {
            toast.error('Vui lòng chọn phương thức thanh toán')
            return null
          }
          if (!userId) {
            toast.error('Vui lòng đăng nhập để tiếp tục')
            return null
          }

          set({ isAiLoading: true })

          // Keep backend Redis state in sync with current UI selections before creating booking
          const saved = await aiBookingService.saveAiBookingState(userId, {
            step: 'SELECT_PAYMENT_METHOD',
            paymentMethod: state.paymentMethod,
          })

          if (!saved) {
            toast.error('Không thể đồng bộ trạng thái đặt vé')
            return null
          }

          // 1) Create order from AI booking state (backend reads AI state)
          const orderResponse = await aiBookingService.createOrderWithAi()
          if (!orderResponse?.success || !orderResponse?.data) {
            toast.error(orderResponse?.error || 'Không thể tạo đơn hàng')
            return null
          }

          const orderData = orderResponse.data as any
          const createdOrder = (orderData?.order || orderData) as OrderType
          if (!createdOrder?.id) {
            toast.error('Không nhận được thông tin đơn hàng hợp lệ')
            return null
          }

          // 2) Create payment URL then redirect
          const paymentUrlResponse = await orderService.createPaymentUrl({
            orderId: createdOrder.id as string,
            amount: createdOrder.total_price,
            paymentMethod: state.paymentMethod as PaymentMethod,
          })

          if (!paymentUrlResponse.success || !paymentUrlResponse.data) {
            toast.error('Không thể tạo URL thanh toán')
            return null
          }

          const paymentUrlData = paymentUrlResponse.data as PaymentUrlResponseData
          const paymentUrl = paymentUrlData.paymentURL
          if (!paymentUrl) {
            toast.error('Không nhận được đường dẫn thanh toán')
            return null
          }

          toast.success('Đặt vé thành công!')

          window.location.href = paymentUrl
          return createdOrder
        } catch (error) {
          console.error('Create AI order error:', error)
          toast.error('Có lỗi xảy ra khi tạo đơn hàng')
          return null
        } finally {
          set({ isAiLoading: false })
        }
      },
      resetAll: () => set(initialState),
    }),
    { name: 'ai-booking-store' }
  )
)
