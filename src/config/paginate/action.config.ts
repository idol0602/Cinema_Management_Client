export const actionPaginateConfig = {
  sortableColumns: [
    {
      value: "name",
      label: "Tên hành động",
    },
    {
      value: "path",
      label: "Đường dẫn",
    },
    {
      value: "method",
      label: "Phương thức",
    },
    {
      value: "created_at",
      label: "Ngày tạo",
    },
  ],
  searchableColumns: [
    {
      value: "name",
      label: "Tên hành động",
    },
    {
      value: "path",
      label: "Đường dẫn",
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
    method: [
      {
        value: "GET",
        label: "GET",
      },
      {
        value: "POST",
        label: "POST",
      },
      {
        value: "PUT",
        label: "PUT",
      },
      {
        value: "DELETE",
        label: "DELETE",
      },
    ],
  },
  defaultSortBy: ["created_at", "DESC"] as [string, string],
  defaultLimit: 10,
};
