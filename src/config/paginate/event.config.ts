export const eventPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên sự kiện",
  },
  {
    value: "start_date",
    label: "Ngày bắt đầu",
  },
  {
    value: "end_date",
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
    label: "Tên sự kiện",
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
    only_at_counter: [
      {
        value: "true",
        label: "Chỉ tại quầy",
      },
      {
        value: "false",
        label: "Online & Quầy",
      },
    ],
    is_in_combo: [
      {
        value: "true",
        label: "Có trong combo",
      },
      {
        value: "false",
        label: "Không có trong combo",
      },
    ],
  },

  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 50,
};
