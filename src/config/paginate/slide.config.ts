export const slidePaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "title",
    label: "Tiêu đề",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

searchableColumns : [
  {
    value: "title",
    label: "Tiêu đề",
  },
  {
    value: "content",
    label: "Nội dung",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
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

  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 50,
};
