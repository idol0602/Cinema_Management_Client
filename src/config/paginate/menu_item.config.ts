export const menuItemPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên món",
  },
  {
    value: "price",
    label: "Giá",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
  {
    value: "num_instock",
    label: "Số lượng tồn",
  },
],

searchableColumns : [
  {
    value: "name",
    label: "Tên món",
  },
  {
    value: "description",
    label: "Mô tả",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {
    item_type: [
      {
      value: "FOOD",
      label: "Đồ ăn",
      },
      {
      value: "DRINK",
      label: "Đồ uống",
      },
      {
      value: "GIFT",
      label: "Quà tặng",
      },
    ],
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
