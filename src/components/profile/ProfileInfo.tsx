'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { User } from '@/types/user.type';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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
} from 'lucide-react';

export function ProfileInfo() {
  const { user, updateProfile } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const updateData: Partial<User> = {};
      if (formData.name && formData.name !== user.name) updateData.name = formData.name;
      if (formData.email && formData.email !== user.email) updateData.email = formData.email;
      if (formData.phone && formData.phone !== user.phone) updateData.phone = formData.phone;
      if (formData.password && formData.password.length > 0)
        updateData.password = formData.password;

      if (Object.keys(updateData).length === 0) {
        toast.info('Không có thay đổi nào cần lưu');
        setIsEditMode(false);
        return;
      }

      await updateProfile({ ...user, ...updateData } as User);
      toast.success('Cập nhật thông tin thành công');
      setIsEditMode(false);
    } catch {
      toast.error('Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Không rõ';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Avatar & Basic Info */}
      <div className="flex items-center gap-6 border-b border-gray-200 pb-8 dark:border-gray-700">
        <Avatar className="h-24 w-24 border-2 border-orange-500/20 transition-colors hover:border-orange-500/50">
          <AvatarImage className="text-4xl font-bold" name={user?.name || ''} />
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user?.name || 'Người dùng'}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Mail className="h-4 w-4" />
            {user?.email}
          </p>
          {user?.created_at && (
            <p className="mt-1 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              Tham gia từ {formatDate(user.created_at)}
            </p>
          )}
        </div>
        <Button
          onClick={() => (isEditMode ? handleCancel() : setIsEditMode(true))}
          variant={isEditMode ? 'outline' : 'default'}
          className={
            isEditMode
              ? ''
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700'
          }
        >
          <Edit className="mr-2 h-4 w-4" />
          {isEditMode ? 'Hủy' : 'Chỉnh sửa'}
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            <UserIcon className="mr-1.5 inline h-4 w-4" />
            Họ và tên
          </label>
          {isEditMode ? (
            <Input
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập họ và tên"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
            />
          ) : (
            <p className="py-2 font-medium text-gray-900 dark:text-gray-100">
              {user?.name || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Mail className="mr-1.5 inline h-4 w-4" />
            Email
          </label>
          {isEditMode ? (
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Nhập email"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
            />
          ) : (
            <p className="py-2 text-gray-900 dark:text-gray-100">
              {user?.email || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Phone className="mr-1.5 inline h-4 w-4" />
            Số điện thoại
          </label>
          {isEditMode ? (
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
            />
          ) : (
            <p className="py-2 text-gray-900 dark:text-gray-100">
              {user?.phone || 'Chưa cập nhật'}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mật khẩu
          </label>
          {isEditMode ? (
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                className="border-gray-300 pr-10 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <p className="py-2 text-gray-900 dark:text-gray-100">••••••••</p>
          )}
        </div>
      </div>

      {/* Save / Cancel */}
      {isEditMode && (
        <div className="flex gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>
        </div>
      )}

      {/* Account Status */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Trạng thái tài khoản</p>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            user?.is_active !== false
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {user?.is_active !== false ? '✓ Hoạt động' : '✗ Không hoạt động'}
        </span>
      </div>
    </div>
  );
}
