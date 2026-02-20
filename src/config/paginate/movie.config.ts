export const moviePaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns: [
    { value: "title", label: "Tên phim" },
    { value: "release_date", label: "Ngày phát hành" },
    { value: "rating", label: "Đánh giá" },
    { value: "duration", label: "Thời lượng" },
    { value: "created_at", label: "Ngày tạo" },
  ],
  // dùng ô search tìm kiếm
  searchableColumns: [
    { value: "title", label: "Tên phim" },
    { value: "description", label: "Mô tả" },
    { value: "director", label: "Đạo diễn" },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {
    is_active: true,
    "movie_movie_types.movie_type_id": true,
  },
  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 50,
  joinTableFields: {
    movie_movie_types: ["id", "movie_type_id"],
  },
};

export const moviePaginateConfigWithStatus = {
  // SORT
  sortableColumns: [
    { value: "title", label: "Tên phim" },
    { value: "release_date", label: "Ngày phát hành" },
    { value: "rating", label: "Đánh giá" },
    { value: "duration", label: "Thời lượng" },
    { value: "created_at", label: "Ngày tạo" },
  ],

  // SEARCH
  searchableColumns: [
    { value: "title", label: "Tên phim" },
    { value: "description", label: "Mô tả" },
    { value: "director", label: "Đạo diễn" },
  ],

  // FILTER (CHỈ column thuộc movies)
  filterableColumns: {
    is_active: true,
  },

  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 50,

  // ⭐ JOIN TABLE CONFIG
  // View đã có sẵn first_show_time, last_show_time → không cần join show_times
  joinTableFields: {
    movie_movie_types: ["id", "movie_type_id"],
  },
};
