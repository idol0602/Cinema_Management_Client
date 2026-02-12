export const comboPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên combo",
  },
  {
    value: "total_price",
    label: "Tổng giá",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

searchableColumns : [
  {
    value: "name",
    label: "Tên combo",
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
    is_event_combo: [
      {
      value: "true",
      label: "Combo sự kiện",
      },
      {
      value: "false",
      label: "Combo món ăn",
      },
    ],
  },

  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 50,
  joinTableFields: {
    combo_movies: ["id", "movie_id"],
    combos_events: ["id", "event_id"],
    combo_items: ["id", "menu_item_id", "quantity", "unit_price", "is_active"],
  },
};
