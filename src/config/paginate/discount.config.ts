export const discountPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên giảm giá",
  },
  {
    value: "discount_percent",
    label: "Phần trăm giảm giá",
  },
  {
    value: "valid_from",
    label: "Ngày bắt đầu",
  },
  {
    value: "valid_to",
    label: "Ngày kết thúc",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

searchableColumns : [
  {
    value: "name",
    label: "Tên giảm giá",
  },
  {
    value: "description",
    label: "Mô tả",
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
