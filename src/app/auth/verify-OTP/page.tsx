import VerifyOTPPage from "@/components/auth/VerifyOTPPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Xác thực OTP - META CINEMA",
  description: "Nhập mã OTP để hoàn tất đăng ký tài khoản tại META CINEMA.",
}

export default function VerifyOTPRoute() {
  return <VerifyOTPPage />
}
