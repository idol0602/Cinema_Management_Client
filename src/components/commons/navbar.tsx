"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Film, Newspaper, Calendar, UtensilsCrossed } from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Film
  },
  {
    href: "/posts",
    label: "Bài báo",
    icon: Newspaper
  },
  {
    href: "/events",
    label: "Sự kiện",
    icon: Calendar
  },
  {
    href: "/combos",
    label: "Combo",
    icon: UtensilsCrossed
  }
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 group relative",
              isActive
                ? "text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
            )}
            {!isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
