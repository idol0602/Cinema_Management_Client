export const statusMap: Record<string, { label: string; color: string }> = {
    COMPLETED: { label: "Hoàn thành", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    PENDING: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    FAILED: { label: "Thất bại", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    CANCELED: { label: "Đã hủy", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    REFUND_PENDING: { label: "Chờ hoàn tiền", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
    REFUNDED: { label: "Đã hoàn tiền", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  }