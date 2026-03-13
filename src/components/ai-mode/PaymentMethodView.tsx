'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useAiBookingStore } from '@/store/useAiBookingStore';
import { PAYMENT_METHODS } from '@/lib/paymentMethods';
import { useAuthStore } from '@/store/useAuthStore';
import { aiBookingService } from '@/services/ai_booking.service';
import BookingConfirmationDialog from '@/components/show-times/BookingConfirmationDialog';
import type { AiBookingStateDetails } from '@/types/aiBookingStateDetails.type';
import type { MenuItemType } from '@/types/menuItem.type';
import type { ComboType } from '@/types/combo.type';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PaymentMethodViewProps {
  initialMenuItems?: MenuItemType[];
  initialCombos?: ComboType[];
}

export function PaymentMethodView({
  initialMenuItems = [],
  initialCombos = [],
}: PaymentMethodViewProps) {
  const { paymentMethod, setPaymentMethod } = useAiBookingStore();
  const { user } = useAuthStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<AiBookingStateDetails | null>(null);

  const canConfirm =
    !!bookingDetails?.movie?.id &&
    !!bookingDetails?.show_time?.id &&
    (bookingDetails?.show_time_seats?.length || 0) > 0 &&
    !!(bookingDetails?.payment_method || paymentMethod);

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
              item_type: sourceMenu.type,
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

  const handleOpenConfirmation = async () => {
    if (!paymentMethod) {
      toast.error('Vui long chon phuong thuc thanh toan');
      return;
    }
    if (!user?.id) {
      toast.error('Vui long dang nhap');
      return;
    }

    // Get both raw state and full details
    const rawState = await aiBookingService.getAiBookingState(user.id);
    let details = await aiBookingService.getAiBookingStateDetails(user.id);
    if (!details) {
      toast.error('Khong the tai trang thai booking');
      return;
    }

    // Enrich menu_items and combos with full data, passing raw state if available
    details = enrichMenuItems(details, rawState);
    details = enrichCombos(details, rawState);

    setBookingDetails({
      ...details,
      payment_method: details.payment_method || paymentMethod,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <div className="mx-auto max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
            <CreditCard className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Chọn phương thức thanh toán
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vui lòng chọn một phương thức để hoàn tất thanh toán
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* MoMo */}
          <button
            type="button"
            onClick={() => setPaymentMethod(PAYMENT_METHODS.MOMO)}
            className={clsx(
              'group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300',
              paymentMethod === PAYMENT_METHODS.MOMO
                ? 'border-pink-400 bg-gradient-to-b from-pink-50 to-white shadow-lg shadow-pink-500/10 dark:from-pink-950/30 dark:to-gray-800'
                : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-pink-600 dark:hover:bg-pink-950/20'
            )}
          >
            {paymentMethod === PAYMENT_METHODS.MOMO && (
              <div className="absolute -right-2 -top-2">
                <CheckCircle className="h-6 w-6 text-pink-500 drop-shadow" />
              </div>
            )}
            <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-gray-700">
              <Image
                src="/images/momo-logo-momo-mobile-money-logo-4kdLuUYj.jpg"
                alt="MoMo"
                width={56}
                height={56}
                className="rounded-lg object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">MoMo</span>
          </button>

          {/* VNPay */}
          <button
            type="button"
            onClick={() => setPaymentMethod(PAYMENT_METHODS.VNPAY)}
            className={clsx(
              'group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all duration-300',
              paymentMethod === PAYMENT_METHODS.VNPAY
                ? 'border-blue-400 bg-gradient-to-b from-blue-50 to-white shadow-lg shadow-blue-500/10 dark:from-blue-950/30 dark:to-gray-800'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600 dark:hover:bg-blue-950/20'
            )}
          >
            {paymentMethod === PAYMENT_METHODS.VNPAY && (
              <div className="absolute -right-2 -top-2">
                <CheckCircle className="h-6 w-6 text-blue-500 drop-shadow" />
              </div>
            )}
            <div className="rounded-xl bg-white p-2 shadow-sm dark:bg-gray-700">
              <Image
                src="/images/Logo-VNPAY-QR-1.webp"
                alt="VNPay"
                width={56}
                height={56}
                className="rounded-lg object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">VNPay</span>
          </button>
        </div>

        {!paymentMethod && (
          <p className="text-center text-sm text-amber-600 dark:text-amber-400">
            ⚠ Vui lòng chọn phương thức thanh toán để tiếp tục
          </p>
        )}

        <Button
          type="button"
          onClick={handleOpenConfirmation}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          Xac nhan va xem thong tin dat ve
        </Button>
      </div>

      <BookingConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bookingDetails={bookingDetails}
        onConfirm={() => setDialogOpen(false)}
        showConfirmButton={canConfirm}
      />
    </>
  );
}
