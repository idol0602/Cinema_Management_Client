export const ticketPricePaginateConfig = {
  sortableColumns: [
    {
      value: "price",
      label: "Giá vé",
    },
    {
      value: "day_type",
      label: "Loại ngày",
    },
    {
      value: "created_at",
      label: "Ngày tạo",
    },
  ],
  searchableColumns: [
    {
      value: "day_type",
      label: "Loại ngày",
    },
  ],
  filterableColumns: {
    is_active: [
      {
        value: "true",
        label: "Đang hoạt động",
      },
      {
        value: "false",
        label: "Ngưng hoạt động",
      },
    ],
    day_type: [
      {
        value: "WEEKDAY",
        label: "Ngày thường",
      },
      {
        value: "WEEKEND",
        label: "Cuối tuần",
      },
    ],
    seat_type_id: [] as any,
    format_id: [] as any,
  },
  defaultSortBy: ["created_at", "DESC"] as [string, string],
  defaultLimit: 10,
};
