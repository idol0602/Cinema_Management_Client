export const orderPaginationConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "created_at",
    label: "Ngày tạo",
  },
  {
    value: "total_price",
    label: "Tổng giá",
  },
],

searchableColumns : [
  {
    value : "id",
    label : "Mã đơn hàng",
  },
  {
    value: "movies.title",
    label: "Tên phim",
  },
  {
    value: "users.name",
    label: "Tên khách hàng",
  },
  {
    value: "users.email",
    label: "Email khách hàng",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {},

  defaultSortBy: [["created_at", "DESC"]],
  defaultLimit: 10,
  maxLimit: 100,
};
