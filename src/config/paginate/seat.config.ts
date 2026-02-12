export const seatPaginateConfig = {
  sortableColumns: [
    {
      value: "seat_number",
      label: "Số ghế",
    },
    {
      value: "type",
      label: "Loại ghế",
    },
  ],

  searchableColumns: [
    {
      value: "seat_number",
      label: "Số ghế",
    },
  ],

  filterableColumns: {
    type: [],
    is_active: [
      {
        value: "true",
        label: "Đang sử dụng",
      },
      {
        value: "false",
        label: "Ngưng sử dụng",
      },
    ],
  },

  defaultSortBy: [["seat_number", "ASC"]],
  defaultLimit: 10,
  maxLimit: 50,
};
