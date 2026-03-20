'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { label: 'Phim đang chiếu', href: '/show-times' },
    { label: 'Phim sắp chiếu', href: '/movies' },
    { label: 'Lịch chiếu', href: '/show-times' },
    { label: 'Giá vé', href: '/ticket-prices' },
  ];

  const supportLinks = [
    { label: 'Chính sách', href: '/posts' },
    { label: 'Điều khoản', href: '/posts' },
    { label: 'Câu hỏi thường gặp', href: '/posts' },
    { label: 'Liên hệ', href: '/profile' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand Section */}
          <div className="space-y-4 text-center sm:text-left">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-40 opacity-90 brightness-0 invert transition-opacity hover:opacity-100">
                <Image src="/images/logo.png" alt="Meta Cinema" fill className="object-contain" />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Trải nghiệm điện ảnh đẳng cấp với công nghệ hiện đại và dịch vụ tận tâm.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="#"
                aria-label="Youtube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 transition-transform duration-300 hover:scale-110"
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm transition-colors duration-300 hover:text-orange-500"
                  >
                    <span className="mr-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:mr-2 group-hover:w-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Hỗ trợ</h3>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm transition-colors duration-300 hover:text-orange-500"
                  >
                    <span className="mr-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:mr-2 group-hover:w-2" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 flex-shrink-0 text-orange-500" />
                <span>support@metacinema.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-400">
              © {currentYear} Meta Cinema. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end md:gap-6">
              <Link href="/posts" className="transition-colors hover:text-orange-500">
                Điều khoản dịch vụ
              </Link>
              <Link href="/posts" className="transition-colors hover:text-orange-500">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
