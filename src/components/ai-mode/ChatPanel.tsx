'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, Sparkles, User, XCircle, Loader2 } from 'lucide-react';
import { aiBookingService } from '@/services/ai_booking.service';
import { showTimeService } from '@/services/showTime.service';
import { showTimeSeatService } from '@/services/showTimeSeat.service';
import { eventService } from '@/services/event.service';
import { useAiBookingStore } from '@/store/useAiBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BookingConfirmationDialog from '@/components/show-times/BookingConfirmationDialog';
import type { AiBookingStateDetails } from '@/types/aiBookingStateDetails.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { ComboType } from '@/types/combo.type';

const STEP_MAP: Record<string, number> = {
  SELECT_MOVIE: 0,
  SELECT_SHOW_TIME: 1,
  SELECT_SHOW_TIME_SEATS: 2,
  SELECT_ADDON: 3,
  SELECT_PAYMENT_METHOD: 4,
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STEP_TO_ACTION: Record<number, string> = {
  0: 'now-showing',
  1: 'showtime',
  2: 'showtime-seat',
  3: 'addon',
  4: 'payment',
};

const isBookingReadyForConfirm = (
  details: AiBookingStateDetails | null,
  fallbackPayment?: string
) => {
  if (!details) return false;
  const hasMovie = !!details.movie?.id;
  const hasShowTime = !!details.show_time?.id;
  const hasSeats = (details.show_time_seats?.length || 0) > 0;
  const hasPaymentMethod = !!(details.payment_method || fallbackPayment);
  return hasMovie && hasShowTime && hasSeats && hasPaymentMethod;
};

interface ChatPanelProps {
  initialMenuItems?: MenuItemType[];
  initialCombos?: ComboType[];
}

export function ChatPanel({ initialMenuItems = [], initialCombos = [] }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Xin chào! 👋 Tôi là trợ lý AI của Meta Cinema. Tôi có thể giúp bạn đặt vé xem phim, chọn suất chiếu, ghế ngồi và combo đồ ăn. Hiện tại có các phim đang chiếu, bạn muốn xem phim gì tôi có thể tư vấn!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDetails, setStatusDetails] = useState<AiBookingStateDetails | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const announcedSeatStepRef = useRef<string>('');
  const announcedShowTimeStepRef = useRef<string>('');
  const announcedAddonStepRef = useRef(false);
  const announcedPaymentStepRef = useRef(false);
  const { user } = useAuthStore();

  const {
    currentStep,
    movieId,
    showTimeId,
    paymentMethod,
    setMovieId,
    setShowTimeId,
    setShowTimeSeatIds,
    setComboIds,
    setMenuItems,
    setEventId,
    setPaymentMethod,
    setCurrentStep,
    setActiveAction,
    setChatData,
    setChatMeta,
    setIsAiLoading,
    resetAll,
  } = useAiBookingStore();

  const syncStateFromBackend = async (options?: {
    preserveActiveAction?: boolean;
    preserveStep?: boolean;
  }) => {
    if (!user?.id) return;
    const state = await aiBookingService.getAiBookingState(user.id);
    if (!state) return;

    setMovieId(state.movieId || null);
    setShowTimeId(state.showTimeId || null);
    setShowTimeSeatIds(Array.isArray(state.showTimeSeatIds) ? state.showTimeSeatIds : []);
    setComboIds(Array.isArray(state.comboIds) ? state.comboIds : []);
    setMenuItems(
      Array.isArray(state.menuItems)
        ? state.menuItems
            .filter((item) => item?.id || item?.menuItemId)
            .map((item) => ({
              id: (item.id || item.menuItemId) as string,
              quantity: Number(item?.quantity || 0),
            }))
            .filter((item) => item.quantity > 0)
        : []
    );
    setEventId(state.eventId || null);
    setPaymentMethod(state.paymentMethod || '');

    // Only sync step from backend if we're not preserving a step that was just set from AI response
    if (!options?.preserveStep && state.step && STEP_MAP[state.step] !== undefined) {
      const nextStep = STEP_MAP[state.step];
      setCurrentStep(nextStep);
      if (!options?.preserveActiveAction && STEP_TO_ACTION[nextStep]) {
        setActiveAction(STEP_TO_ACTION[nextStep]);
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const message = inputValue.trim();
    setInputValue('');
    setIsSending(true);
    setIsAiLoading(true);

    try {
      const responses = await aiBookingService.chatWithAgent(message, user?.id);

      let hasExplicitAction = false;
      let hasStepUpdate = false;
      let lastResponsiveStep: string | null = null;

      if (responses && responses.length > 0) {
        for (const resp of responses) {
          // Update step if present
          if (resp.step && STEP_MAP[resp.step] !== undefined) {
            hasStepUpdate = true;
            lastResponsiveStep = resp.step;
            const nextStep = STEP_MAP[resp.step];
            setCurrentStep(nextStep);
            // Only set action from step mapping if no explicit action in response
            if (!resp.action && STEP_TO_ACTION[nextStep]) {
              setActiveAction(STEP_TO_ACTION[nextStep]);
            }
          }

          // Update action — only change if not null/"other"
          // This takes precedence over step-derived action
          if (resp.action && resp.action !== 'other') {
            hasExplicitAction = true;
            setActiveAction(resp.action);
          }

          // Update data if hasData
          if (resp.hasData && resp.data !== null) {
            // resp.data may be a paginated response object { data: [...], meta, ... }
            // or already a plain array — normalize to always store the array
            const raw = resp.data;
            const items = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
            setChatData(items);
            setChatMeta(raw?.meta ?? null);

            // If moving to showtime step but movieId hasn't been set yet, infer from payload.
            if ((!movieId || movieId === '') && Array.isArray(items) && items.length > 0) {
              const inferredMovieId = (items[0] as any)?.movie_id || (items[0] as any)?.movies?.id;
              if (inferredMovieId) {
                setMovieId(inferredMovieId);
              }
            }
          }

          // Add assistant message
          if (resp.message) {
            setMessages((prev) => [
              ...prev,
              {
                id: `${Date.now()}-${Math.random()}`,
                role: 'assistant',
                content: resp.message,
                timestamp: new Date(),
              },
            ]);
          }
        }
      }

      // If step was updated from response, save it to backend immediately to ensure consistency
      if (hasStepUpdate && lastResponsiveStep && user?.id) {
        await aiBookingService.saveAiBookingState(user.id, { step: lastResponsiveStep });
      }

      // Sync from backend but preserve the step if it was updated in this response
      await syncStateFromBackend({
        preserveActiveAction: hasExplicitAction,
        preserveStep: hasStepUpdate,
      });
    } catch (error: any) {
      toast.error('Lỗi kết nối AI');
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    syncStateFromBackend();
  }, [user?.id]);

  useEffect(() => {
    if (currentStep === 1 && movieId && announcedShowTimeStepRef.current !== movieId) {
      announcedShowTimeStepRef.current = movieId;
      announcedSeatStepRef.current = '';
      announcedAddonStepRef.current = false;
      announcedPaymentStepRef.current = false;
      setActiveAction('showtime');
      setIsAiLoading(true);

      showTimeService
        .findAndPaginate({
          page: 1,
          limit: '',
          filter: { movie_id: movieId },
          sortBy: 'start_time:ASC',
        } as any)
        .then((response) => {
          if (response.success) {
            const items = Array.isArray(response.data)
              ? response.data
              : Array.isArray((response.data as any)?.data)
                ? (response.data as any).data
                : [];
            setChatData(items);
            setChatMeta((response.data as any)?.meta ?? null);
          }
        })
        .finally(() => setIsAiLoading(false));
    }
  }, [currentStep, movieId, setActiveAction, setChatData, setChatMeta, setIsAiLoading]);

  useEffect(() => {
    if (currentStep === 2 && showTimeId && announcedSeatStepRef.current !== showTimeId) {
      announcedSeatStepRef.current = showTimeId;
      announcedAddonStepRef.current = false;
      announcedPaymentStepRef.current = false;
      setActiveAction('showtime-seat');
      setIsAiLoading(true);

      showTimeSeatService
        .findAndPaginate({
          page: 1,
          limit: '',
          filter: { show_time_id: showTimeId },
        })
        .then((response) => {
          if (response.success) {
            const items = Array.isArray(response.data)
              ? response.data
              : Array.isArray((response.data as any)?.data)
                ? (response.data as any).data
                : [];
            setChatData(items);
            setChatMeta((response.data as any)?.meta ?? null);
            setMessages((prev) => [
              ...prev,
              {
                id: `seat-auto-${Date.now()}`,
                role: 'assistant',
                content: 'Đây là sơ đồ ghế và trạng thái ghế bạn có muốn tôi tư vấn cho bạn không?',
                timestamp: new Date(),
              },
            ]);
          }
        })
        .finally(() => setIsAiLoading(false));
    }
  }, [currentStep, showTimeId, setActiveAction, setChatData, setChatMeta, setIsAiLoading]);

  useEffect(() => {
    if (currentStep === 3 && !announcedAddonStepRef.current) {
      announcedAddonStepRef.current = true;
      announcedPaymentStepRef.current = false;
      setActiveAction('addon');
      setMessages((prev) => [
        ...prev,
        {
          id: `addon-auto-${Date.now()}`,
          role: 'assistant',
          content: 'Hiện tại chúng tôi có các combo, món ăn và sự kiện sau bạn có muốn chọn không?',
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentStep, setActiveAction]);

  useEffect(() => {
    if (currentStep === 4 && !announcedPaymentStepRef.current) {
      announcedPaymentStepRef.current = true;
      setActiveAction('payment');
      setMessages((prev) => [
        ...prev,
        {
          id: `payment-auto-${Date.now()}`,
          role: 'assistant',
          content: 'Bạn có thể chọn phương thức thanh toán ở khung bên trái.',
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentStep, setActiveAction]);

  /**
   * Enrich menu_items data with full details from initialMenuItems
   * Handles both item_id and menuItemId property names
   */
  const enrichMenuItems = (
    details: AiBookingStateDetails,
    rawState?: any
  ): AiBookingStateDetails => {
    let menuItems = details.menu_items || [];

    // If menu_items is empty but we have stored menuItems, use those
    if (menuItems.length === 0 && rawState?.menuItems?.length) {
      menuItems = rawState.menuItems.map((item: any) => ({
        item_id: item.menuItemId || item.id,
        quantity: item.quantity || 1,
        unit_price: 0,
        total_price: 0,
      }));
    }

    if (menuItems.length === 0) {
      return details;
    }

    const enrichedMenuItems = menuItems.map((menuItem: any) => {
      // Support both item_id and menuItemId field names
      const menuItemId = menuItem.item_id || menuItem.menuItemId;
      const sourceMenu = initialMenuItems.find((m) => m.id === menuItemId);

      return {
        ...menuItem,
        item_id: menuItemId,
        item: sourceMenu
          ? {
              id: sourceMenu.id,
              name: sourceMenu.name,
              description: sourceMenu.description,
              item_type: sourceMenu.item_type,
              image: sourceMenu.image,
            }
          : menuItem.item,
      };
    });

    return {
      ...details,
      menu_items: enrichedMenuItems,
    };
  };

  /**
   * Enrich combos data with full details from initialCombos
   */
  const enrichCombos = (details: AiBookingStateDetails, rawState?: any): AiBookingStateDetails => {
    let combos = details.combos || [];

    // If combos is empty but we have stored comboIds, rebuild from raw state
    if (combos.length === 0 && rawState?.comboIds?.length) {
      combos = rawState.comboIds.map((comboId: string) => {
        const sourceCombo = initialCombos.find((c) => c.id === comboId);
        return sourceCombo || { id: comboId, name: '', total_price: 0 };
      });
    }

    if (combos.length === 0) {
      return details;
    }

    const enrichedCombos = combos.map((combo: any) => {
      const sourceCombo = initialCombos.find((c) => c.id === combo.id);

      if (!sourceCombo) return combo;

      const enrichedComboItems =
        combo.combo_items?.map((comboItem: any) => {
          const sourceMenuItem = initialMenuItems.find((m) => m.id === comboItem.menu_item?.id);

          return {
            ...comboItem,
            menu_item: sourceMenuItem
              ? {
                  id: sourceMenuItem.id,
                  name: sourceMenuItem.name,
                }
              : comboItem.menu_item,
          };
        }) || [];

      return {
        ...combo,
        combo_items: enrichedComboItems,
      };
    });

    return {
      ...details,
      combos: enrichedCombos,
    };
  };

  /**
   * Enrich event data with full details from API
   */
  const enrichEvent = async (
    details: AiBookingStateDetails,
    rawState?: any
  ): Promise<AiBookingStateDetails> => {
    // Use event from details or rawState
    const eventId = details.event?.id || rawState?.eventId;

    if (!eventId) {
      return details;
    }

    // If event already has full details, return as-is
    if (details.event && details.event.name) {
      return details;
    }

    // Fetch full event details from API
    try {
      const response = await eventService.getById(eventId);
      if (response.success && response.data) {
        const eventData = response.data as any;
        return {
          ...details,
          event: {
            id: eventData.id,
            name: eventData.name,
          },
        };
      }
    } catch (error) {
      console.error('Failed to enrich event:', error);
    }

    return details;
  };

  const handleViewBookingStatus = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    // Get both raw state and full details
    const rawState = await aiBookingService.getAiBookingState(user.id);
    let details = await aiBookingService.getAiBookingStateDetails(user.id);
    if (!details) {
      toast.error('Không thể tải trạng thái booking');
      return;
    }

    // Enrich menu_items, combos, and event with full data, passing raw state if available
    details = enrichMenuItems(details, rawState);
    details = enrichCombos(details, rawState);
    details = await enrichEvent(details, rawState);

    setStatusDetails({
      ...details,
      payment_method: details.payment_method || paymentMethod,
    });
    setStatusDialogOpen(true);
  };

  const handleCancelBooking = async () => {
    if (!user?.id) {
      toast.error('Vui lòng đăng nhập');
      return;
    }
    try {
      await aiBookingService.clearAiBookingState(user.id);
      resetAll();
      setMessages([
        {
          id: 'reset',
          role: 'assistant',
          content: 'Đã hủy booking thành công. Bạn có thể bắt đầu lại từ đầu!',
          timestamp: new Date(),
        },
      ]);
      toast.success('Đã hủy booking');
    } catch {
      toast.error('Không thể hủy booking');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Chat Header */}
      <div className="shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="flex items-center gap-1.5 text-sm font-semibold text-white">
                <Bot className="h-3.5 w-3.5" />
                AI Trợ Lý Đặt Vé
              </h3>
              <p className="text-[10px] text-orange-100">Powered by Meta Cinema AI</p>
            </div>
          </div>
          <button
            onClick={handleViewBookingStatus}
            className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
            title="Xem trạng thái booking"
          >
            Xem trạng thái booking
          </button>
          <button
            onClick={handleCancelBooking}
            className="flex items-center gap-1 rounded-lg bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
            title="Hủy booking"
          >
            <XCircle className="h-3.5 w-3.5" />
            Hủy
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="min-w-0 flex-1 overflow-hidden p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="h-3.5 w-3.5 text-white" />
                ) : (
                  <User className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <div
                className={`min-w-0 max-w-[85%] overflow-hidden rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      table: ({ children }) => (
                        <div className="my-2 overflow-x-auto">
                          <table className="min-w-full border-collapse border border-gray-300 text-xs dark:border-gray-600">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gray-200 dark:bg-gray-600">{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 px-2 py-1 text-left font-semibold dark:border-gray-600">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-2 py-1 dark:border-gray-600">
                          {children}
                        </td>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-1 list-inside list-disc">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-1 list-inside list-decimal">{children}</ol>
                      ),
                      li: ({ children }) => <li className="mb-0.5">{children}</li>,
                    }}
                  >
                    {msg.content.replace(/<br\s*\/?>/gi, '\n')}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {/* AI typing indicator */}
          {isSending && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-700">
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-orange-400"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-orange-400"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-orange-400"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            disabled={isSending}
            className="flex-1 border-gray-300 text-sm focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="h-9 w-9 shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <BookingConfirmationDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        bookingDetails={statusDetails}
        onConfirm={() => setStatusDialogOpen(false)}
        showConfirmButton={isBookingReadyForConfirm(statusDetails, paymentMethod)}
      />
    </div>
  );
}
