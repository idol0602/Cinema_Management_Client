export const seatTypePaginateConfig = {
  sortableColumns: [
    {
      value: "name",
      label: "Tên loại ghế",
    },
    {
      value: "created_at",
      label: "Ngày tạo",
    },
  ],
  searchableColumns: [
    {
      value: "name",
      label: "Tên loại ghế",
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
  },
  defaultSortBy: ["created_at", "DESC"] as [string, string],
  defaultLimit: 10,
};
