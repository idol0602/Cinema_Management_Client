"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative w-40 h-12 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity">
                <Image
                  src="/images/logo.png"
                  alt="Meta Cinema"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Trải nghiệm điện ảnh đẳng cấp với công nghệ hiện đại và dịch vụ tận tâm.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/30"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {["Phim đang chiếu", "Phim sắp chiếu", "Lịch chiếu", "Giá vé"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm hover:text-orange-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Hỗ trợ</h3>
            <ul className="space-y-2">
              {["Chính sách", "Điều khoản", "Câu hỏi thường gặp", "Liên hệ"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm hover:text-orange-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span>support@metacinema.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} Meta Cinema. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-orange-500 transition-colors">
                Điều khoản dịch vụ
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
