export const showTimePaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "start_time",
    label: "Thời gian bắt đầu",
  },
  {
    value: "end_time",
    label: "Thời gian kết thúc",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
],

  searchableColumns : [
    {
    value: "movies.title",
    label: "Tiêu đề phim",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {
    // movie_id: [
    //   {
    //   value: "true",
    //   label: "Có phim",
    //   },
    // ],
    // room_id: [
    //   {
    //   value: "true",
    //   label: "Có phòng",
    //   },
    // ],
    //start_time
    day_type: [
      {
      value: "weekday",
      label: "Ngày thường",
      },
      {
      value: "weekend",
      label: "Cuối tuần",
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
  joinTableFields: {
    movies: [
      "id",
      "title",
      "thumbnail",
      "description",
      "release_date",
      "duration",
    ],
    rooms: ["id", "name"],
  },
};
