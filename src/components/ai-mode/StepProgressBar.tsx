"use client"

import { cn } from "@/lib/utils"
import { Film, Clock, Armchair, ShoppingCart, CreditCard, Check } from "lucide-react"

const steps = [
  { id: 0, label: "Chọn phim", icon: Film },
  { id: 1, label: "Chọn suất chiếu", icon: Clock },
  { id: 2, label: "Chọn ghế", icon: Armchair },
  { id: 3, label: "Tùy chọn đi kèm", icon: ShoppingCart },
  { id: 4, label: "Thanh toán", icon: CreditCard },
]

interface StepProgressBarProps {
  currentStep: number
  onStepClick?: (step: number) => void
}

export function StepProgressBar({ currentStep, onStepClick }: StepProgressBarProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.id
          const isCurrent = currentStep === step.id
          const isUpcoming = currentStep < step.id

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <button
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "flex items-center gap-2 group transition-all duration-300",
                  onStepClick && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 shrink-0",
                    isCompleted &&
                      "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-500/30",
                    isCurrent &&
                      "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110",
                    isUpcoming &&
                      "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium hidden lg:block whitespace-nowrap transition-colors",
                    isCompleted && "text-green-600 dark:text-green-400",
                    isCurrent && "text-orange-600 dark:text-orange-400 font-semibold",
                    isUpcoming && "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isCompleted
                        ? "w-full bg-gradient-to-r from-green-500 to-emerald-500"
                        : isCurrent
                        ? "w-1/2 bg-gradient-to-r from-orange-500 to-orange-600"
                        : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
