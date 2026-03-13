'use client';

import { cn } from '@/lib/utils';
import { Film, Clock, Armchair, ShoppingCart, CreditCard, Check } from 'lucide-react';

const steps = [
  { id: 0, label: 'Chọn phim', icon: Film },
  { id: 1, label: 'Chọn suất chiếu', icon: Clock },
  { id: 2, label: 'Chọn ghế', icon: Armchair },
  { id: 3, label: 'Tùy chọn đi kèm', icon: ShoppingCart },
  { id: 4, label: 'Thanh toán', icon: CreditCard },
];

interface StepProgressBarProps {
  currentStep: number;
}

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center last:flex-none">
              {/* Step Circle */}
              <div className="flex items-center gap-2 transition-all duration-300">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted &&
                      'border-green-500 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30',
                    isCurrent &&
                      'scale-110 border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30',
                    isUpcoming &&
                      'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={cn(
                    'hidden whitespace-nowrap text-sm font-medium transition-colors lg:block',
                    isCompleted && 'text-green-600 dark:text-green-400',
                    isCurrent && 'font-semibold text-orange-600 dark:text-orange-400',
                    isUpcoming && 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="mx-3 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isCompleted
                        ? 'w-full bg-gradient-to-r from-green-500 to-emerald-500'
                        : isCurrent
                          ? 'w-1/2 bg-gradient-to-r from-orange-500 to-orange-600'
                          : 'w-0'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
