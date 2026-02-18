"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"

export function ResetPasswordForm() {
    const params = useParams<{ token: string }>()
    const searchParams = useSearchParams()
    const token = params.token || searchParams.get("token")

    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await authService.resetPassword(token, data.password)
      
      if (!response.success) {
        setError(response.error || "Có lỗi xảy ra")
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</AlertDescription>
        </Alert>
        <Link href="/auth/forgot-password">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Yêu cầu lại mật khẩu
          </Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Đặt lại mật khẩu thành công
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.
          </p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          Đặt lại mật khẩu
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Nhập mật khẩu mới của bạn
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <div className="relative">
            <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                <Eye className="h-4 w-4 text-gray-400" />
                )}
                <span className="sr-only">Hide password</span>
            </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
            <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-500" : ""}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                <Eye className="h-4 w-4 text-gray-400" />
                )}
                <span className="sr-only">Hide password</span>
            </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            "Đang xử lý..."
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Đặt lại mật khẩu
            </>
          )}
        </Button>

        <Link href="/auth/login" className="block">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Button>
        </Link>
      </div>
    </form>
  )
}
