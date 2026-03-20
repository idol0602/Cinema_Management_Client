'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Film, Newspaper, Calendar, UtensilsCrossed, DollarSign, Sparkles } from 'lucide-react';

const navItems = [
  {
    href: '/',
    label: 'Trang chủ',
    icon: Film,
  },
  {
    href: '/posts',
    label: 'Bài báo',
    icon: Newspaper,
  },
  {
    href: '/events',
    label: 'Sự kiện',
    icon: Calendar,
  },
  {
    href: '/combos',
    label: 'Combos & Đồ ăn',
    icon: UtensilsCrossed,
  },
  {
    href: '/ticket-prices',
    label: 'Giá vé',
    icon: DollarSign,
  },
  {
    href: '/ai-mode',
    label: 'Đặt Vé Với AI',
    icon: Sparkles,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-2 lg:flex xl:gap-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium transition-all duration-300 xl:px-3 xl:text-base',
              isActive
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-700 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
            )}
            {!isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-x-100" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
