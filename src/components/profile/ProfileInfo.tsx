"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { User } from "@/types/user.type"
import {
  Mail,
  Phone,
  Edit,
  Eye,
  EyeOff,
  X,
  Check,
  User as UserIcon,
  Calendar,
  Loader2,
} from "lucide-react"

export function ProfileInfo() {
  const { user, updateProfile } = useAuthStore()
  const [isEditMode, setIsEditMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      })
    }
  }, [user])

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const updateData: Partial<User> = {}
      if (formData.name && formData.name !== user.name) updateData.name = formData.name
      if (formData.email && formData.email !== user.email) updateData.email = formData.email
      if (formData.phone && formData.phone !== user.phone) updateData.phone = formData.phone
      if (formData.password && formData.password.length > 0) updateData.password = formData.password

      if (Object.keys(updateData).length === 0) {
        toast.info("Không có thay đổi nào cần lưu")
        setIsEditMode(false)
        return
      }

      await updateProfile({ ...user, ...updateData } as User)
      toast.success("Cập nhật thông tin thành công")
      setIsEditMode(false)
    } catch {
      toast.error("Đã có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditMode(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Không rõ"
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Avatar & Basic Info */}
      <div className="flex items-center gap-6 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 text-4xl font-bold uppercase flex-shrink-0">
          {user?.name?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {user?.name || "Người dùng"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
          {user?.created_at && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Tham gia từ {formatDate(user.created_at)}
            </p>
          )}
        </div>
        <Button
          onClick={() => (isEditMode ? handleCancel() : setIsEditMode(true))}
          variant={isEditMode ? "outline" : "default"}
          className={
            isEditMode
              ? ""
              : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
          }
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditMode ? "Hủy" : "Chỉnh sửa"}
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <UserIcon className="inline w-4 h-4 mr-1.5" />
            Họ và tên
          </label>
          {isEditMode ? (
            <Input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập họ và tên"
              className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100 font-medium py-2">
              {user?.name || "Chưa cập nhật"}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="inline w-4 h-4 mr-1.5" />
            Email
          </label>
          {isEditMode ? (
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email"
              className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100 py-2">
              {user?.email || "Chưa cập nhật"}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Phone className="inline w-4 h-4 mr-1.5" />
            Số điện thoại
          </label>
          {isEditMode ? (
            <Input
              type="tel"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
              className="border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
            />
          ) : (
            <p className="text-gray-900 dark:text-gray-100 py-2">
              {user?.phone || "Chưa cập nhật"}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mật khẩu
          </label>
          {isEditMode ? (
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                className="pr-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-gray-100 py-2">••••••••</p>
          )}
        </div>
      </div>

      {/* Save / Cancel */}
      {isEditMode && (
        <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
        </div>
      )}

      {/* Account Status */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Trạng thái tài khoản</p>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            user?.is_active !== false
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {user?.is_active !== false ? "✓ Hoạt động" : "✗ Không hoạt động"}
        </span>
      </div>
    </div>
  )
}
