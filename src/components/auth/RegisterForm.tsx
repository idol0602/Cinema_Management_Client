"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const router = useRouter()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Send OTP instead of registering directly
      const response = await authService.sendOtp({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      })

      if (response.error) {
        setError(response.error)
        setIsLoading(false)
        return
      }

      // Redirect to OTP verification page
      setSuccess(true)
      setTimeout(() => {
        router.push(`/auth/verify-OTP?email=${encodeURIComponent(data.email)}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại")
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Đang chuyển hướng...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
          Tạo tài khoản mới
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Đăng ký để trải nghiệm dịch vụ
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Họ và tên</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nguyễn Văn A"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="name@example.com"
          {...register("email")}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại (không bắt buộc)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0123456789"
          {...register("phone")}
          className={errors.phone ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Mật khẩu</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-red-500" : ""}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          disabled={isLoading}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tôi đồng ý với{" "}
          <span className="text-orange-600 hover:text-orange-700 cursor-pointer">
            Điều khoản dịch vụ
          </span>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
        disabled={!agreedToTerms || isLoading}
      >
        {isLoading ? (
          "Đang đăng ký..."
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-2" />
            Đăng ký
          </>
        )}
      </Button>
    </form>
  )
}
