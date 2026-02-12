export const movieTypePaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "type",
    label: "Thể loại",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

searchableColumns : [
  {
    value: "type",
    label: "Thể loại",
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
  maxLimit: 100,
};
