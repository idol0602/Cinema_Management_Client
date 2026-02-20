import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';

import { showTimeSeatService } from '@/services/showTimeSeat.service';
import { comboService } from '@/services/combo.service';
import { menuItemService } from '@/services/menuItem.service';
import { eventService } from '@/services/event.service';
import { ticketPriceService } from '@/services/ticketPrice.service';
import { discountService } from '@/services/discount.service';
import { orderService, validateBookingTime } from '@/services/order.service';
import { showTimeService } from '@/services/showTime.service';

import type { ShowTimeDetailType, SeatDetail } from '@/types/showTime.type';
import type { ComboType, ComboDetailType } from '@/types/combo.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { EventType } from '@/types/event.type';
import type { DiscountType } from '@/types/discount.type';
import type { TicketPriceType } from '@/types/ticketPrice.type';
import type { OrderType, CreateOrderType } from '@/types/order.type';
import type { CreateTicketType } from '@/types/ticket.type';
import type { CreateComboItemInTicketType } from '@/types/comboItemInTicket.type';
import type { CreateMenuItemInTicketType } from '@/types/menuItemInTicket.type';

export interface EventWithDiscount extends EventType {
  discount?: DiscountType | null;
}

interface TimeRemainData {
  userId: string;
  heldAt: string;
  expiresAt: string;
}

interface BookingStore {
  // Showtime
  showTimeDetail: ShowTimeDetailType | null;
  loading: boolean;

  // Extras loading
  loadingCombos: boolean;
  loadingMenuItems: boolean;
  loadingEvents: boolean;
  loadingExtras: boolean;

  // Ticket Prices
  prices: Map<string, number>;
  ticketPrices: TicketPriceType[];

  // Combos
  combos: ComboType[];
  selectedCombos: ComboType[];
  comboDiscounts: Map<string, number>;
  comboSearch: string;

  // Menu Items
  menuItems: MenuItemType[];
  selectedMenuItems: { item: MenuItemType; quantity: number }[];
  menuItemSearch: string;

  // Events & Discounts
  events: EventWithDiscount[];
  discounts: DiscountType[];
  selectedEvent: EventWithDiscount | null;
  eventSearch: string;

  // Seat selection & hold
  selectedSeats: SeatDetail[];
  isHolding: boolean;
  heldSeatIds: string[];
  holdCountdown: number;
  holdLoading: boolean;
  timeRemain: TimeRemainData | null;

  // Order
  orderCreating: OrderType | null;

  // Cached combo details
  selectedComboDetails: Map<string, ComboDetailType>;

  // Confirmation dialog
  confirmDialogOpen: boolean;

  // Countdown interval ref
  _countdownInterval: ReturnType<typeof setInterval> | null;

  // Actions
  loadShowTimeDetail: (showTimeId: string) => Promise<void>;
  loadCombos: () => Promise<void>;
  loadMenuItems: () => Promise<void>;
  loadEvents: () => Promise<void>;
  loadPrices: () => Promise<void>;
  loadUserHeldSeats: () => Promise<void>;
  loadComboDetails: (comboId: string) => Promise<ComboDetailType | null>;

  selectSeat: (seat: SeatDetail) => void;
  deselectSeat: (seatId: string) => void;
  toggleSeatSelection: (seat: SeatDetail) => void;
  canSelectSeat: (seat: SeatDetail) => boolean;
  isSeatSelected: (seat: SeatDetail) => boolean;

  handleHoldSeats: (userId: string) => Promise<void>;
  handleCancelHold: () => Promise<void>;
  startCountdown: (seconds: number) => void;
  stopCountdown: () => void;

  handleComboToggle: (combo: ComboType, movieId?: string, movieTitle?: string) => Promise<void>;
  setComboSearch: (search: string) => void;

  handleMenuItemQuantityChange: (item: MenuItemType, delta: number) => void;
  setMenuItemSearch: (search: string) => void;

  handleEventSelect: (event: EventWithDiscount) => void;
  setEventSearch: (search: string) => void;

  setConfirmDialogOpen: (open: boolean) => void;

  getPrice: (formatId: string, seatTypeId: string, dayType: string) => number;
  getTicketPriceId: (formatId: string, seatTypeId: string, dayType: string) => string;

  handlePayment: (userId: string) => Promise<any>;
  generateOrderData: (userId: string) => any;

  resetBooking: () => void;
  refreshShowTimeDetail: (showTimeId: string) => Promise<void>;
}

const HOLD_TTL_SECONDS = 600;

export const useBookingStore = create<BookingStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      showTimeDetail: null,
      loading: false,
      loadingCombos: false,
      loadingMenuItems: false,
      loadingEvents: false,
      loadingExtras: false,
      prices: new Map(),
      ticketPrices: [],
      combos: [],
      selectedCombos: [],
      comboDiscounts: new Map(),
      comboSearch: '',
      menuItems: [],
      selectedMenuItems: [],
      menuItemSearch: '',
      events: [],
      discounts: [],
      selectedEvent: null,
      eventSearch: '',
      selectedSeats: [],
      isHolding: false,
      heldSeatIds: [],
      holdCountdown: 0,
      holdLoading: false,
      timeRemain: null,
      orderCreating: null,
      selectedComboDetails: new Map(),
      confirmDialogOpen: false,
      _countdownInterval: null,

      loadShowTimeDetail: async (showTimeId: string) => {
        set({ loading: true });
        try {
          const response = await showTimeService.getShowTimeDetails(showTimeId);
          if (response.success && response.data) {
            set({ showTimeDetail: response.data as ShowTimeDetailType });
            const state = get();
            state.loadCombos();
            state.loadMenuItems();
            state.loadEvents();
            state.loadPrices();
          }
        } catch (error) {
          console.error('Error loading showtime details:', error);
        } finally {
          set({ loading: false });
        }
      },

      loadCombos: async () => {
        set({ loadingCombos: true });
        try {
          const response = await comboService.findAndPaginate({
            page: 1,
            limit: 100,
            sortBy: 'name:ASC',
            filter: { is_active: true },
          });
          if (response.success) set({ combos: response.data as ComboType[] });
        } catch (error) {
          console.error('Error loading combos:', error);
        } finally {
          set({ loadingCombos: false });
        }
      },

      loadMenuItems: async () => {
        set({ loadingMenuItems: true });
        try {
          const response = await menuItemService.findAndPaginate({
            page: 1,
            limit: 100,
            sortBy: 'name:ASC',
            filter: { is_active: true },
          });
          if (response.success) set({ menuItems: response.data as MenuItemType[] });
        } catch (error) {
          console.error('Error loading menu items:', error);
        } finally {
          set({ loadingMenuItems: false });
        }
      },

      loadEvents: async () => {
        set({ loadingEvents: true });
        try {
          const [eventResponse, discountResponse] = await Promise.all([
            eventService.findAndPaginate({
              page: 1,
              limit: 100,
              sortBy: 'name:ASC',
              filter: { is_in_combo: false, is_active: true },
            }),
            discountService.getAll(),
          ]);

          let loadedDiscounts: DiscountType[] = [];
          if (discountResponse.success && discountResponse.data) {
            loadedDiscounts = discountResponse.data as DiscountType[];
            set({ discounts: loadedDiscounts });
          }

          if (eventResponse.success) {
            const eventsData = eventResponse.data as EventType[];
            const eventsWithDiscount: EventWithDiscount[] = eventsData.map((event) => ({
              ...event,
              discount:
                loadedDiscounts.find(
                  (d) => d.event_id === event.id && d.is_active
                ) || null,
            }));
            set({ events: eventsWithDiscount });
          }
        } catch (error) {
          console.error('Error loading events:', error);
        } finally {
          set({ loadingEvents: false });
        }
      },

      loadPrices: async () => {
        try {
          const response = await ticketPriceService.getAll();
          if (response.success && response.data) {
            const priceMap = new Map<string, number>();
            const ticketPricesData = response.data as TicketPriceType[];
            ticketPricesData.forEach((tp) => {
              priceMap.set(`${tp.format_id}-${tp.seat_type_id}-${tp.day_type}`, tp.price);
            });
            set({ prices: priceMap, ticketPrices: ticketPricesData });
          }
        } catch (error) {
          console.error('Error loading ticket prices:', error);
        }
      },

      loadUserHeldSeats: async () => {
        const { showTimeDetail, startCountdown } = get();
        if (!showTimeDetail) return;
        try {
          const response = await showTimeSeatService.getAllHeldSeatsByUserId();
          const heldData = response.data as any[] | undefined;
          if (response.success && heldData && heldData.length > 0) {
            const currentShowTimeHeldSeats = heldData.filter((hold: any) =>
              showTimeDetail.room?.seats?.some(
                (seat) => seat.show_time_seat?.id === hold.showTimeSeatId
              )
            );

            if (currentShowTimeHeldSeats.length > 0) {
              const seatsToRestore = currentShowTimeHeldSeats
                .map((hold: any) =>
                  showTimeDetail.room?.seats?.find(
                    (seat) => seat.show_time_seat?.id === hold.showTimeSeatId
                  )
                )
                .filter(Boolean) as SeatDetail[];

              if (seatsToRestore.length > 0) {
                const seatIds = seatsToRestore
                  .map((s) => s.show_time_seat?.id)
                  .filter(Boolean) as string[];

                const firstHold = currentShowTimeHeldSeats[0];
                const expiresAt = new Date(firstHold.expiresAt);
                const now = new Date();
                const remainingSeconds = Math.max(
                  0,
                  Math.floor((expiresAt.getTime() - now.getTime()) / 1000)
                );

                if (remainingSeconds > 0) {
                  set({
                    heldSeatIds: seatIds,
                    selectedSeats: seatsToRestore,
                    isHolding: true,
                    timeRemain: firstHold,
                  });
                  startCountdown(remainingSeconds);
                } else {
                  set({ isHolding: false, heldSeatIds: [], selectedSeats: [] });
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading user held seats:', error);
        }
      },

      loadComboDetails: async (comboId: string) => {
        try {
          const response = await comboService.getDetails(comboId);
          if (response.success) return response.data as ComboDetailType;
        } catch (error) {
          console.error('Error loading combo details:', error);
        }
        return null;
      },

      selectSeat: (seat: SeatDetail) => {
        set((state) => ({
          selectedSeats: [...state.selectedSeats, seat],
        }));
      },

      deselectSeat: (seatId: string) => {
        set((state) => ({
          selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
        }));
      },

      toggleSeatSelection: (seat: SeatDetail) => {
        const { canSelectSeat, selectedSeats } = get();
        if (!canSelectSeat(seat)) return;
        const exists = selectedSeats.find((s) => s.id === seat.id);
        if (exists) {
          set({ selectedSeats: selectedSeats.filter((s) => s.id !== seat.id) });
        } else {
          set({ selectedSeats: [...selectedSeats, seat] });
        }
      },

      canSelectSeat: (seat: SeatDetail) => {
        const { isHolding } = get();
        if (isHolding) return false;
        if (!seat.is_active) return false;
        const status = seat.show_time_seat?.status_seat;
        return !status || status === 'AVAILABLE';
      },

      isSeatSelected: (seat: SeatDetail) => {
        return get().selectedSeats.some((s) => s.id === seat.id);
      },

      handleHoldSeats: async (userId: string) => {
        const { selectedSeats, showTimeDetail, selectedEvent, startCountdown } = get();
        if (selectedSeats.length === 0) {
          toast.error('Vui lòng chọn ít nhất một ghế');
          return;
        }
        set({ holdLoading: true });
        try {
          const seatIds = selectedSeats
            .map((s) => s.show_time_seat?.id)
            .filter(Boolean) as string[];

          const response = await showTimeSeatService.bulkHoldSeats(seatIds, HOLD_TTL_SECONDS);

          const orderResponse = await orderService.create({
            discount_id: selectedEvent?.discount?.id || null,
            user_id: userId,
            movie_id: showTimeDetail?.movie?.id as string,
            service_vat: 0,
            payment_status: 'PENDING',
            payment_method: '',
            trans_id: null,
            total_price: 0,
            created_at: new Date().toISOString(),
            requested_at: new Date().toISOString(),
          } as CreateOrderType);

          if (orderResponse.success && orderResponse.data) {
            set({ orderCreating: orderResponse.data as OrderType });
          }

          if (response.success) {
            set({ isHolding: true, heldSeatIds: seatIds });
            startCountdown(HOLD_TTL_SECONDS);
            toast.success(`Đã giữ ${selectedSeats.length} ghế trong 10 phút`);
          } else {
            toast.error(response.error || 'Không thể giữ ghế');
          }
        } catch (error) {
          toast.error('Có lỗi xảy ra');
          console.error(error);
        } finally {
          set({ holdLoading: false });
        }
      },

      handleCancelHold: async () => {
        const { heldSeatIds, orderCreating, stopCountdown } = get();
        if (heldSeatIds.length === 0) return;
        set({ holdLoading: true });
        try {
          const response = await showTimeSeatService.bulkCancelHoldSeats(heldSeatIds);

          if (orderCreating?.id) {
            await orderService.update(orderCreating.id, { payment_status: 'CANCELED' });
          }

          if (response.success) {
            stopCountdown();
            set({
              isHolding: false,
              heldSeatIds: [],
              holdCountdown: 0,
              selectedSeats: [],
              orderCreating: null,
            });
            toast.success('Đã hủy giữ ghế');
          } else {
            toast.error(response.error || 'Không thể hủy');
          }
        } catch (error) {
          toast.error('Có lỗi');
          console.error(error);
        } finally {
          set({ holdLoading: false });
        }
      },

      startCountdown: (seconds: number) => {
        const { _countdownInterval } = get();
        if (_countdownInterval) clearInterval(_countdownInterval);

        set({ holdCountdown: seconds });
        const interval = setInterval(() => {
          const current = get().holdCountdown;
          if (current <= 1) {
            clearInterval(interval);
            set({
              holdCountdown: 0,
              isHolding: false,
              heldSeatIds: [],
              _countdownInterval: null,
            });
            toast.warning('Thời gian giữ ghế đã hết.');
          } else {
            set({ holdCountdown: current - 1 });
          }
        }, 1000);
        set({ _countdownInterval: interval });
      },

      stopCountdown: () => {
        const { _countdownInterval } = get();
        if (_countdownInterval) {
          clearInterval(_countdownInterval);
          set({ _countdownInterval: null, holdCountdown: 0 });
        }
      },

      handleComboToggle: async (combo: ComboType, movieId?: string, movieTitle?: string) => {
        const { selectedCombos, loadComboDetails } = get();

        if (selectedCombos.some((c) => c.id === combo.id)) {
          set((state) => {
            const newDiscounts = new Map(state.comboDiscounts);
            newDiscounts.delete(combo.id!);
            return {
              selectedCombos: state.selectedCombos.filter((c) => c.id !== combo.id),
              comboDiscounts: newDiscounts,
            };
          });
          return;
        }

        const details = await loadComboDetails(combo.id!);

        if (combo.is_event_combo && (details?.combo_movies?.length ?? 0) > 0) {
          const comboMovieIds = details!.combo_movies!.map((cm: any) => cm.movie?.id);
          if (movieId && !comboMovieIds.includes(movieId)) {
            toast.error(
              `Combo "${combo.name}" không áp dụng cho phim "${movieTitle || 'hiện tại'}"`
            );
            return;
          }
        }

        if ((details?.combos_events?.length ?? 0) > 0) {
          const comboEvent = details!.combos_events![0];
          const eventDiscount = (comboEvent?.event as any)?.discount;
          if (eventDiscount?.is_active && eventDiscount?.discount_percent > 0) {
            set((state) => {
              const newDiscounts = new Map(state.comboDiscounts);
              newDiscounts.set(combo.id!, eventDiscount.discount_percent);
              return { comboDiscounts: newDiscounts };
            });
            toast.success(`Combo "${combo.name}" có giảm giá ${eventDiscount.discount_percent}%!`);
          }
        }

        if (details) {
          set((state) => {
            const newDetails = new Map(state.selectedComboDetails);
            newDetails.set(combo.id!, details);
            return { selectedComboDetails: newDetails };
          });
        }

        set((state) => ({
          selectedCombos: [...state.selectedCombos, combo],
        }));
      },

      setComboSearch: (search: string) => set({ comboSearch: search }),

      handleMenuItemQuantityChange: (item: MenuItemType, delta: number) => {
        set((state) => {
          const prev = state.selectedMenuItems;
          const existing = prev.find((m) => m.item.id === item.id);
          if (existing) {
            const newQty = existing.quantity + delta;
            if (newQty <= 0) return { selectedMenuItems: prev.filter((m) => m.item.id !== item.id) };
            return {
              selectedMenuItems: prev.map((m) =>
                m.item.id === item.id ? { ...m, quantity: newQty } : m
              ),
            };
          }
          if (delta > 0) return { selectedMenuItems: [...prev, { item, quantity: 1 }] };
          return {};
        });
      },

      setMenuItemSearch: (search: string) => set({ menuItemSearch: search }),

      handleEventSelect: (event: EventWithDiscount) => {
        set((state) => ({
          selectedEvent: state.selectedEvent?.id === event.id ? null : event,
        }));
      },

      setEventSearch: (search: string) => set({ eventSearch: search }),

      setConfirmDialogOpen: (open: boolean) => set({ confirmDialogOpen: open }),

      getPrice: (formatId: string, seatTypeId: string, dayType: string) => {
        return get().prices.get(`${formatId}-${seatTypeId}-${dayType}`) || 0;
      },

      getTicketPriceId: (formatId: string, seatTypeId: string, dayType: string) => {
        const tp = get().ticketPrices.find(
          (t) => t.format_id === formatId && t.seat_type_id === seatTypeId && t.day_type === dayType
        );
        return tp?.id || '';
      },

      generateOrderData: (userId: string) => {
        const state = get();
        const { orderCreating, selectedSeats, selectedCombos, selectedMenuItems, selectedEvent, showTimeDetail } = state;

        const seatTotal = selectedSeats.reduce(
          (sum, s) =>
            sum +
            state.getPrice(
              showTimeDetail?.room?.format?.id as string,
              s.seat_type?.id as string,
              showTimeDetail?.day_type as string
            ),
          0
        );
        const comboTotal = selectedCombos.reduce((sum, c) => sum + (c.total_price || 0), 0);
        const menuTotal = selectedMenuItems.reduce((sum, m) => sum + m.item.price * m.quantity, 0);
        const subtotal = seatTotal + comboTotal + menuTotal;

        let totalDiscountPercent = 0;
        if (selectedEvent?.discount && selectedEvent.discount.is_active) {
          totalDiscountPercent += selectedEvent.discount.discount_percent || 0;
        }
        state.comboDiscounts.forEach((percent) => {
          totalDiscountPercent += percent;
        });

        const discountAmount = Math.round((subtotal * totalDiscountPercent) / 100);
        const afterDiscount = subtotal - discountAmount;
        const SERVICE_FEE_PERCENT = 10;
        const serviceVat = Math.round((afterDiscount * SERVICE_FEE_PERCENT) / 100);
        const total = afterDiscount + serviceVat;

        const order: OrderType = {
          id: orderCreating?.id as string,
          user_id: userId,
          movie_id: showTimeDetail?.movie?.id as string,
          discount_id: selectedEvent?.discount?.id as string,
          service_vat: serviceVat,
          total_price: total,
        };

        const tickets: CreateTicketType[] = selectedSeats.map((seat) => ({
          ticket_price_id: state.getTicketPriceId(
            showTimeDetail?.room?.format?.id as string,
            seat.seat_type?.id as string,
            showTimeDetail?.day_type as string
          ),
          order_id: orderCreating?.id as string,
          showtime_seat_id: seat.show_time_seat?.id as string,
        }));

        const comboItemInTickets: CreateComboItemInTicketType[] = selectedCombos.map((combo) => ({
          order_id: orderCreating?.id as string,
          combo_id: combo.id as string,
        }));

        const menuItemInTickets: CreateMenuItemInTicketType[] = selectedMenuItems.map((m) => ({
          order_id: orderCreating?.id as string,
          item_id: m.item.id as string,
          quantity: m.quantity,
          unit_price: m.item.price,
          total_price: m.item.price * m.quantity,
        }));

        const showTime = {
          id: showTimeDetail?.id,
          start_time: showTimeDetail?.start_time,
          end_time: showTimeDetail?.end_time,
          day_type: showTimeDetail?.day_type,
        };

        return { order, tickets, comboItemInTickets, menuItemInTickets, showTime };
      },

      handlePayment: async (userId: string) => {
        const state = get();
        const { showTimeDetail } = state;

        if (showTimeDetail?.start_time) {
          const timeValidation = validateBookingTime(showTimeDetail.start_time, 5);
          if (!timeValidation.valid) {
            toast.error(timeValidation.message);
            set({ confirmDialogOpen: false });
            return null;
          }
        }

        const orderData = state.generateOrderData(userId);

        try {
          const response = await orderService.processOrderPayment(orderData);

          if (response.success && response.data) {
            toast.success('Đặt vé thành công!');
            state.stopCountdown();
            set({ confirmDialogOpen: false });
            return response.data;
          } else {
            if (typeof response.error === 'string') {
              toast.error(response.error);
            } else if ((response as any).error?.message) {
              toast.error((response as any).error.message);
            } else {
              toast.error('Có lỗi xảy ra khi xử lý thanh toán');
            }
            return null;
          }
        } catch (error) {
          console.error('Payment error:', error);
          toast.error('Có lỗi xảy ra khi xử lý thanh toán');
          return null;
        }
      },

      resetBooking: () => {
        const { _countdownInterval } = get();
        if (_countdownInterval) clearInterval(_countdownInterval);
        set({
          selectedSeats: [],
          isHolding: false,
          heldSeatIds: [],
          holdCountdown: 0,
          selectedCombos: [],
          selectedMenuItems: [],
          selectedEvent: null,
          comboDiscounts: new Map(),
          orderCreating: null,
          selectedComboDetails: new Map(),
          confirmDialogOpen: false,
          _countdownInterval: null,
        });
      },

      refreshShowTimeDetail: async (showTimeId: string) => {
        try {
          const response = await showTimeService.getShowTimeDetails(showTimeId);
          if (response.success && response.data) {
            set({ showTimeDetail: response.data as ShowTimeDetailType });
          }
        } catch (error) {
          console.error('Error refreshing showtime:', error);
        }
      },
    }),
    { name: 'booking-store' }
  )
);

// Selector hooks for computed values
export const useCalculatedTotals = () => {
  return useBookingStore(
    useShallow((state) => {
      const { selectedSeats, selectedCombos, selectedMenuItems, selectedEvent, comboDiscounts, showTimeDetail, prices } = state;

      const seatTotal = selectedSeats.reduce(
        (sum, s) =>
          sum +
          (prices.get(
            `${showTimeDetail?.room?.format?.id}-${s.seat_type?.id}-${showTimeDetail?.day_type}`
          ) || 0),
        0
      );
      const comboTotal = selectedCombos.reduce((sum, c) => sum + (c.total_price || 0), 0);
      const menuTotal = selectedMenuItems.reduce((sum, m) => sum + m.item.price * m.quantity, 0);
      const subtotal = seatTotal + comboTotal + menuTotal;

      let totalDiscountPercent = 0;
      if (selectedEvent?.discount && selectedEvent.discount.is_active) {
        totalDiscountPercent += selectedEvent.discount.discount_percent || 0;
      }
      comboDiscounts.forEach((percent) => {
        totalDiscountPercent += percent;
      });

      const discountAmount = Math.round((subtotal * totalDiscountPercent) / 100);
      const afterDiscount = subtotal - discountAmount;
      const SERVICE_FEE_PERCENT = 10;
      const serviceVat = Math.round((afterDiscount * SERVICE_FEE_PERCENT) / 100);
      const total = afterDiscount + serviceVat;

      return {
        seatTotal,
        comboTotal,
        menuTotal,
        subtotal,
        discountPercent: totalDiscountPercent,
        discountAmount,
        serviceVatPercent: SERVICE_FEE_PERCENT,
        serviceVat,
        total,
      };
    })
  );
};

export const useFilteredCombos = () => {
  return useBookingStore(
    useShallow((state) =>
      state.combos.filter((c) =>
        c.name.toLowerCase().includes(state.comboSearch.toLowerCase())
      )
    )
  );
};

export const useFilteredMenuItems = () => {
  return useBookingStore(
    useShallow((state) =>
      state.menuItems.filter((m) =>
        m.name.toLowerCase().includes(state.menuItemSearch.toLowerCase())
      )
    )
  );
};

export const useFilteredEvents = () => {
  return useBookingStore(
    useShallow((state) =>
      state.events.filter((e) =>
        e.name.toLowerCase().includes(state.eventSearch.toLowerCase())
      )
    )
  );
};