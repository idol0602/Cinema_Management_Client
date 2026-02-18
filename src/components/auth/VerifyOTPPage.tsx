"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { authService } from "@/services/auth.service"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Mail, RefreshCw, ShieldCheck } from "lucide-react"
import Image from "next/image"

const OTP_LENGTH = 6

function VerifyOTPContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (pasted.length === 0) return

    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== OTP_LENGTH) {
      setError("Vui lòng nhập đầy đủ mã OTP")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.verifyOtp(email, otpCode)

      if (response.error) {
        setError(response.error)
        setIsLoading(false)
        return
      }

      setSuccess(true)

      // Auto-login: the verify-otp endpoint already sets the cookie
      // Update zustand store with user data
      if (response.data?.user) {
        useAuthStore.setState({ user: response.data.user, isAuthenticated: true })
      }

      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Xác thực OTP thất bại")
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setIsResending(true)
    setError(null)

    try {
      const response = await authService.resendOtp(email)
      if (response.error) {
        setError(response.error)
      } else {
        setError(null)
      }
      setResendCooldown(60)
    } catch (err: any) {
      setError(err.message || "Gửi lại OTP thất bại")
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Thiếu thông tin email
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Vui lòng đăng ký tài khoản trước
        </p>
        <Button onClick={() => router.push("/auth/login")} variant="outline">
          Về trang đăng ký
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
          Đăng ký thành công!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Đang chuyển hướng về trang chủ...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Xác thực OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Mã OTP đã được gửi đến
        </p>
        <p className="font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          {email}
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* OTP Input */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold border-2 focus:border-orange-500 focus:ring-orange-500"
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading || otp.some((d) => !d)}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-12 text-base font-semibold"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Đang xác thực...
          </span>
        ) : (
          "Xác nhận"
        )}
      </Button>

      {/* Resend */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Không nhận được mã?{" "}
        {resendCooldown > 0 ? (
          <span className="text-orange-500 font-semibold">
            Gửi lại sau {resendCooldown}s
          </span>
        ) : (
          <Button
            variant="link"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
            className="text-orange-500 hover:text-orange-600 p-0 h-auto"
          >
            {isResending ? "Đang gửi..." : "Gửi lại mã"}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/images/bg.jpg"
          alt="Cinema Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Xác Thực Tài Khoản</h1>
          <p className="text-lg text-gray-200">
            Nhập mã OTP để hoàn tất đăng ký tài khoản META CINEMA
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="text-center py-8">Đang tải...</div>}>
            <VerifyOTPContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
