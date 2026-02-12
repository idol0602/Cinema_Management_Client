export const userPaginateConfig = {
  // dùng combobox chọn tiêu chí sort
  sortableColumns : [
  {
    value: "name",
    label: "Tên người dùng",
  },
  {
    value: "created_at",
    label: "Ngày tạo",
  },
  {
    value: "points",
    label: "Điểm",
  },
],

searchableColumns : [
  {
    value: "name",
    label: "Tên người dùng",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "phone",
    label: "Số điện thoại",
  },
  ],
  // dùng combobox chọn tiêu chí lọc
  filterableColumns: {
    role: [
      {
      value: "ADMIN",
      label: "Quản trị viên",
      },
      {
      value: "STAFF",
      label: "Nhân viên",
      },
      {
      value: "CUSTOMER",
      label: "Khách hàng",
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
