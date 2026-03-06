"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Ticket, Sparkles, MessageSquareText, Bot, Film, Popcorn } from "lucide-react"
import Link from "next/link"

export function BookingSidebar() {
  return (
    <Sidebar
      side="right"
      collapsible="offcanvas"
      className="border-l border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <SidebarHeader className="p-0">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-1.5">
                <Bot className="h-4 w-4" />
                AI Đặt Vé
              </h3>
              <p className="text-xs text-orange-100">
                Trợ lý thông minh đặt vé
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Đặt vé nhanh
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-950/20">
                  <Ticket className="h-10 w-10 text-orange-500" />
                </div>
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <h4 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                Đặt vé thông minh với AI
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Tính năng đang được phát triển. Bạn có thể xem phim đang chiếu tại trang chủ và đặt vé trực tiếp.
              </p>

              <div className="w-full space-y-3">
                <Link href="/" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25 transition-all duration-300"
                  >
                    <Film className="mr-2 h-4 w-4" />
                    Xem phim đang chiếu
                  </Button>
                </Link>
                <Link href="/combos" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                  >
                    <Popcorn className="mr-2 h-4 w-4" />
                    Xem combo & đồ ăn
                  </Button>
                </Link>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Sparkles className="h-3 w-3" />
            <span>Powered by Meta Cinema AI</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
