"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Home,
  ClipboardList,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/useBookingStore";
import { OrderDetailDialog } from "@/components/profile/OrderDetailDialog";
import { useState } from "react";

type PaymentStatus = "PAID" | "FAILED" | "CANCELLED" | "EXPIRED" | string;

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
    icon: <CheckCircle2 className="w-16 h-16" />,
    title: "Thanh toán thành công!",
    description:
      "Đơn hàng của bạn đã được xác nhận. Vui lòng kiểm tra email để nhận thông tin chi tiết.",
    color: "text-emerald-500",
    bgGradient:
      "from-emerald-500/10 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/10 ring-emerald-500/20",
  },
  FAILED: {
    icon: <XCircle className="w-16 h-16" />,
    title: "Thanh toán thất bại",
    description:
      "Giao dịch không thể hoàn tất. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.",
    color: "text-red-500",
    bgGradient: "from-red-500/10 via-red-500/5 to-transparent",
    iconBg: "bg-red-500/10 ring-red-500/20",
  },
  CANCELLED: {
    icon: <Ban className="w-16 h-16" />,
    title: "Đã hủy thanh toán",
    description:
      "Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được lưu và bạn có thể thanh toán lại.",
    color: "text-amber-500",
    bgGradient:
      "from-amber-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/10 ring-amber-500/20",
  },
  EXPIRED: {
    icon: <Clock className="w-16 h-16" />,
    title: "Hết thời gian thanh toán",
    description:
      "Phiên thanh toán đã hết hạn. Vui lòng tạo đơn hàng mới để tiếp tục.",
    color: "text-orange-500",
    bgGradient:
      "from-orange-500/10 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/10 ring-orange-500/20",
  },
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VNPAY: "VNPay",
  MOMO: "MoMo",
};

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const cleanupDone = useRef(false);

  const orderId = searchParams.get("orderId") || "";
  const status = (searchParams.get("status") || "FAILED") as PaymentStatus;
  const method = searchParams.get("method") || "";
  const transId = searchParams.get("transId") || "";

  const config = STATUS_MAP[status] || STATUS_MAP.FAILED;
  const methodLabel = PAYMENT_METHOD_LABELS[method] || method;
  const isSuccess = status === "PAID";

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
      } catch (error) {
        console.error("Error cleaning up booking state:", error);
        // Still reset even if cancel fails
        useBookingStore.getState().resetBooking();
      }
    };

    cleanup();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Background glow effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${config.bgGradient} pointer-events-none -z-10 opacity-60`}
        />

        <Card className="relative overflow-hidden border-0 shadow-2xl bg-card/80 backdrop-blur-xl">
          {/* Top accent bar */}
          <div
            className={`h-1.5 w-full ${
              isSuccess
                ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                : status === "CANCELLED"
                ? "bg-gradient-to-r from-amber-400 to-amber-600"
                : status === "EXPIRED"
                ? "bg-gradient-to-r from-orange-400 to-orange-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}
          />

          <CardContent className="pt-10 pb-8 px-8 flex flex-col items-center text-center space-y-6">
            {/* Animated Icon */}
            <div
              className={`p-5 rounded-full ring-2 ${config.iconBg} ${config.color} animate-in zoom-in-50 duration-500`}
            >
              {config.icon}
            </div>

            {/* Title */}
            <h1
              className={`text-2xl font-bold tracking-tight ${config.color} animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100`}
            >
              {config.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
              {config.description}
            </p>

            {/* Order Info */}
            {(orderId || methodLabel) && (
              <div className="w-full space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
                <div className="h-px bg-border" />
                <div className="space-y-2 text-sm">
                  {orderId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Mã đơn hàng</span>
                      <span className="font-mono text-xs bg-muted px-2.5 py-1 rounded-md max-w-[200px] truncate">
                        {orderId}
                      </span>
                    </div>
                  )}
                  {methodLabel && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Phương thức
                      </span>
                      <span className="font-semibold">{methodLabel}</span>
                    </div>
                  )}
                  {transId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Mã giao dịch
                      </span>
                      <span className="font-mono text-xs bg-muted px-2.5 py-1 rounded-md">
                        {transId}
                      </span>
                    </div>
                  )}
                  {isSuccess && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Đã thanh toán
                      </span>
                    </div>
                  )}
                </div>
                <div className="h-px bg-border" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full pt-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-[400ms]">
              {isSuccess && orderId && (
                <Button
                  onClick={() => setIsDetailOpen(true)}
                  className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-emerald-500/20 py-6 text-base font-semibold"
                >
                  <Eye className="w-5 h-5" />
                  Xem chi tiết hóa đơn
                </Button>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 hover:bg-muted/50 transition-colors py-6"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    Về trang chủ
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2 hover:bg-muted/50 transition-colors py-6"
                >
                  <Link href="/profile">
                    <ClipboardList className="w-4 h-4" />
                    Lịch sử đơn hàng
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-20 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-20 pointer-events-none" />
      </div>

      <OrderDetailDialog
        orderId={orderId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[80vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Đang xử lý kết quả...</p>
          </div>
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
