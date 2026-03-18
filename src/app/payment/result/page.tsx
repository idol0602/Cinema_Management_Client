'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Clock, Ban, Home, ClipboardList, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBookingStore } from '@/store/useBookingStore';
import { useAiBookingStore } from '@/store/useAiBookingStore';
import { aiBookingService } from '@/services/ai_booking.service';
import { useAuthStore } from '@/store/useAuthStore';
import { OrderDetailDialog } from '@/components/profile/OrderDetailDialog';
import { useState } from 'react';

type PaymentStatus = 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | string;

interface StatusConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bgGradient: string;
  iconBg: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  PAID: {
    icon: <CheckCircle2 className="h-16 w-16" />,
    title: 'Thanh toán thành công!',
    description:
      'Đơn hàng của bạn đã được xác nhận. Vui lòng kiểm tra email để nhận thông tin chi tiết.',
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 ring-emerald-500/20',
  },
  FAILED: {
    icon: <XCircle className="h-16 w-16" />,
    title: 'Thanh toán thất bại',
    description:
      'Giao dịch không thể hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
    color: 'text-red-500',
    bgGradient: 'from-red-500/10 via-red-500/5 to-transparent',
    iconBg: 'bg-red-500/10 ring-red-500/20',
  },
  CANCELLED: {
    icon: <Ban className="h-16 w-16" />,
    title: 'Đã hủy thanh toán',
    description:
      'Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được lưu và bạn có thể thanh toán lại.',
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 ring-amber-500/20',
  },
  EXPIRED: {
    icon: <Clock className="h-16 w-16" />,
    title: 'Hết thời gian thanh toán',
    description: 'Phiên thanh toán đã hết hạn. Vui lòng tạo đơn hàng mới để tiếp tục.',
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-orange-500/10 ring-orange-500/20',
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
};

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const cleanupDone = useRef(false);

  const orderId = searchParams.get('orderId') || '';
  const status = (searchParams.get('status') || 'FAILED') as PaymentStatus;
  const method = searchParams.get('method') || '';
  const transId = searchParams.get('transId') || '';

  const config = STATUS_MAP[status] || STATUS_MAP.FAILED;
  const methodLabel = PAYMENT_METHOD_LABELS[method] || method;
  const isSuccess = status === 'PAID';

  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Cancel held seats and reset booking store on page load
  useEffect(() => {
    if (cleanupDone.current) return;
    cleanupDone.current = true;

    const cleanup = async () => {
      try {
        // Use getState to ensure we have the rehydrated state
        const state = useBookingStore.getState();
        // Cancel held seats if any exist
        if (state.heldSeatIds.length > 0) {
          await state.handleCancelHold();
        }
        // Reset booking store regardless
        state.resetBooking();

        // Also clean up Ai booking store
        const aiState = useAiBookingStore.getState();
        aiState.resetAll();
        
        const userId = useAuthStore.getState().user?.id;
        if (userId) {
          await aiBookingService.clearAiBookingState(userId);
        }

      } catch (error) {
        console.error('Error cleaning up booking state:', error);
        // Still reset even if cancel fails
        useBookingStore.getState().resetBooking();
        useAiBookingStore.getState().resetAll();
      }
    };

    cleanup();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} pointer-events-none -z-10 opacity-60`}
        />

        <Card className="relative overflow-hidden border-0 bg-card/80 shadow-2xl backdrop-blur-xl">
          {/* Top accent bar */}
          <div
            className={`h-1.5 w-full ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                : status === 'CANCELLED'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                  : status === 'EXPIRED'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                    : 'bg-gradient-to-r from-red-400 to-red-600'
            }`}
          />

          <CardContent className="flex flex-col items-center space-y-6 px-8 pb-8 pt-10 text-center">
            {/* Animated Icon */}
            <div
              className={`rounded-full p-5 ring-2 ${config.iconBg} ${config.color} duration-500 animate-in zoom-in-50`}
            >
              {config.icon}
            </div>

            {/* Title */}
            <h1
              className={`text-2xl font-bold tracking-tight ${config.color} delay-100 duration-500 animate-in fade-in slide-in-from-bottom-3`}
            >
              {config.title}
            </h1>

            {/* Description */}
            <p className="max-w-sm leading-relaxed text-muted-foreground delay-200 duration-500 animate-in fade-in slide-in-from-bottom-3">
              {config.description}
            </p>

            {/* Order Info */}
            {(orderId || methodLabel) && (
              <div className="w-full space-y-3 pt-2 delay-300 duration-500 animate-in fade-in slide-in-from-bottom-3">
                <div className="h-px bg-border" />
                <div className="space-y-2 text-sm">
                  {orderId && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mã đơn hàng</span>
                      <span className="max-w-[200px] truncate rounded-md bg-muted px-2.5 py-1 font-mono text-xs">
                        {orderId}
                      </span>
                    </div>
                  )}
                  {methodLabel && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phương thức</span>
                      <span className="font-semibold">{methodLabel}</span>
                    </div>
                  )}
                  {transId && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mã giao dịch</span>
                      <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs">
                        {transId}
                      </span>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        Đã thanh toán
                      </span>
                    </div>
                  )}
                </div>
                <div className="h-px bg-border" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="delay-[400ms] flex w-full flex-col gap-3 pt-2 duration-500 animate-in fade-in slide-in-from-bottom-3">
              {isSuccess && orderId && (
                <Button
                  onClick={() => setIsDetailOpen(true)}
                  className="w-full gap-2 border-0 bg-gradient-to-r from-emerald-500 to-emerald-600 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Eye className="h-5 w-5" />
                  Xem chi tiết hóa đơn
                </Button>
              )}

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 py-6 transition-colors hover:bg-muted/50"
                >
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Về trang chủ
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 py-6 transition-colors hover:bg-muted/50"
                >
                  <Link href="/profile">
                    <ClipboardList className="h-4 w-4" />
                    Lịch sử đơn hàng
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute -left-24 -top-24 -z-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 -z-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <OrderDetailDialog orderId={orderId} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Đang xử lý kết quả...</p>
          </div>
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
