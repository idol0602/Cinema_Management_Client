"use client"

import Image from "next/image"
import Link from "next/link"
import { ForgotPasswordForm } from "./ForgotPasswordForm"

export function ForgotPasswordPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="relative w-48 h-16">
            <Image
              src="/images/logo.png"
              alt="Meta Cinema"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <ForgotPasswordForm />
        </div>

        {/* Footer */}
        <p className="text-center text-white mt-6 text-sm">
          © 2026 Meta Cinema. All rights reserved.
        </p>
      </div>
    </div>
  )
}
