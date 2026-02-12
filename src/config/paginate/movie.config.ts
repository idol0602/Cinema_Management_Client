export const moviePaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "title",
    label: "Tiêu đề",
  },
  {
    value: "release_date",
    label: "Ngày công chiếu",
  },
  {
    value: "rating",
    label: "Đánh giá",
  },
  {
    value: "duration",
    label: "Thời lượng",
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
    value: "description",
    label: "Mô tả",
  },
  {
    value: "director",
    label: "Đạo diễn",
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
