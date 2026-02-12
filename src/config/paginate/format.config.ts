export const formatPaginateConfig = {
  sortableColumns: [
    {
      value: "name",
      label: "Tên định dạng",
    },
    {
      value: "created_at",
      label: "Ngày tạo",
    },
  ],
  searchableColumns: [
    {
      value: "name",
      label: "Tên định dạng",
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
