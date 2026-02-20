/**
 * Shared seat type color configuration for Client
 */

export interface SeatTypeColorConfig {
  bg: string;
  border: string;
  name: string;
  legendBg: string;
  available: string;
  holding: string;
  booked: string;
}

export const seatTypeColors: Record<string, SeatTypeColorConfig> = {
  STANDARD: {
    bg: "bg-blue-100 dark:bg-blue-500/20",
    border: "border-blue-400 dark:border-blue-400",
    name: "Standard",
    legendBg: "bg-blue-400 dark:bg-blue-500 border-blue-500",
    available: "bg-blue-100 dark:bg-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/30 text-blue-800 dark:text-blue-200 cursor-pointer border-blue-400 dark:border-blue-400 border-2",
    holding: "bg-blue-200 dark:bg-blue-500/30 text-blue-900 dark:text-blue-200 cursor-not-allowed border-blue-400 border-2 border-dashed",
    booked: "bg-blue-500 text-white cursor-not-allowed border-blue-700 border-2",
  },
  VIP: {
    bg: "bg-amber-100 dark:bg-amber-500/20",
    border: "border-amber-400 dark:border-amber-400",
    name: "VIP",
    legendBg: "bg-amber-400 dark:bg-amber-500 border-amber-500",
    available: "bg-amber-100 dark:bg-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 cursor-pointer border-amber-400 dark:border-amber-400 border-2",
    holding: "bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 cursor-not-allowed border-amber-400 border-2 border-dashed",
    booked: "bg-amber-500 text-white cursor-not-allowed border-amber-700 border-2",
  },
  COUPLE: {
    bg: "bg-pink-100 dark:bg-pink-500/20",
    border: "border-pink-400 dark:border-pink-400",
    name: "Couple",
    legendBg: "bg-pink-400 dark:bg-pink-500 border-pink-500",
    available: "bg-pink-100 dark:bg-pink-500/20 hover:bg-pink-200 dark:hover:bg-pink-500/30 text-pink-800 dark:text-pink-200 cursor-pointer border-pink-400 dark:border-pink-400 border-2",
    holding: "bg-pink-200 dark:bg-pink-500/30 text-pink-900 dark:text-pink-200 cursor-not-allowed border-pink-400 border-2 border-dashed",
    booked: "bg-pink-500 text-white cursor-not-allowed border-pink-700 border-2",
  },
  SWEETBOX: {
    bg: "bg-purple-100 dark:bg-purple-500/20",
    border: "border-purple-400 dark:border-purple-400",
    name: "Sweet Box",
    legendBg: "bg-purple-400 dark:bg-purple-500 border-purple-500",
    available: "bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 text-purple-800 dark:text-purple-200 cursor-pointer border-purple-400 dark:border-purple-400 border-2",
    holding: "bg-purple-200 dark:bg-purple-500/30 text-purple-900 dark:text-purple-200 cursor-not-allowed border-purple-400 border-2 border-dashed",
    booked: "bg-purple-500 text-white cursor-not-allowed border-purple-700 border-2",
  },
  DELUXE: {
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
    border: "border-emerald-400 dark:border-emerald-400",
    name: "Deluxe",
    legendBg: "bg-emerald-400 dark:bg-emerald-500 border-emerald-500",
    available: "bg-emerald-100 dark:bg-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 cursor-pointer border-emerald-400 dark:border-emerald-400 border-2",
    holding: "bg-emerald-200 dark:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 cursor-not-allowed border-emerald-400 border-2 border-dashed",
    booked: "bg-emerald-500 text-white cursor-not-allowed border-emerald-700 border-2",
  },
  PREMIUM: {
    bg: "bg-cyan-100 dark:bg-cyan-500/20",
    border: "border-cyan-400 dark:border-cyan-400",
    name: "Premium",
    legendBg: "bg-cyan-400 dark:bg-cyan-500 border-cyan-500",
    available: "bg-cyan-100 dark:bg-cyan-500/20 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 text-cyan-800 dark:text-cyan-200 cursor-pointer border-cyan-400 dark:border-cyan-400 border-2",
    holding: "bg-cyan-200 dark:bg-cyan-500/30 text-cyan-900 dark:text-cyan-200 cursor-not-allowed border-cyan-400 border-2 border-dashed",
    booked: "bg-cyan-500 text-white cursor-not-allowed border-cyan-700 border-2",
  },
  IMAX: {
    bg: "bg-indigo-100 dark:bg-indigo-500/20",
    border: "border-indigo-400 dark:border-indigo-400",
    name: "IMAX",
    legendBg: "bg-indigo-400 dark:bg-indigo-500 border-indigo-500",
    available: "bg-indigo-100 dark:bg-indigo-500/20 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 cursor-pointer border-indigo-400 dark:border-indigo-400 border-2",
    holding: "bg-indigo-200 dark:bg-indigo-500/30 text-indigo-900 dark:text-indigo-200 cursor-not-allowed border-indigo-400 border-2 border-dashed",
    booked: "bg-indigo-500 text-white cursor-not-allowed border-indigo-700 border-2",
  },
  DBOX: {
    bg: "bg-orange-100 dark:bg-orange-500/20",
    border: "border-orange-400 dark:border-orange-400",
    name: "D-BOX",
    legendBg: "bg-orange-400 dark:bg-orange-500 border-orange-500",
    available: "bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-800 dark:text-orange-200 cursor-pointer border-orange-400 dark:border-orange-400 border-2",
    holding: "bg-orange-200 dark:bg-orange-500/30 text-orange-900 dark:text-orange-200 cursor-not-allowed border-orange-400 border-2 border-dashed",
    booked: "bg-orange-500 text-white cursor-not-allowed border-orange-700 border-2",
  },
};

export const getSeatTypeColor = (type: string): SeatTypeColorConfig => {
  return seatTypeColors[type] || seatTypeColors.STANDARD;
};

export const seatStatusColors: Record<string, { class: string }> = {
  AVAILABLE: {
    class: "hover:scale-105 cursor-pointer transition-transform",
  },
  SELECTED: {
    class: "bg-orange-500 text-white ring-2 ring-orange-500 ring-offset-1 scale-110 cursor-pointer",
  },
  HOLDING: {
    class: "border-2 border-dashed cursor-not-allowed opacity-80",
  },
  BOOKED: {
    class: "bg-gray-500 border-2 border-gray-700 text-white cursor-not-allowed",
  },
  FIXING: {
    class: "bg-red-600 border-2 border-gray-400 opacity-60 cursor-not-allowed relative",
  },
};
