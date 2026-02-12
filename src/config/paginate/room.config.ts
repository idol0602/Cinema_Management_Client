export const roomPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên phòng",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

searchableColumns : [
  {
    value: "name",
    label: "Tên phòng",
  },
  {
    value: "location",
    label: "Vị trí",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {
    format: [
      {
      value: "2D",
      label: "2D",
      },
      {
      value: "3D",
      label: "3D",
      },
      {
      value: "IMAX",
      label: "IMAX",
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
  maxLimit: 100,
};
