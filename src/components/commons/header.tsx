'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthStore';
import { Navbar } from './navbar';
import { ThemeToggle } from '../theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { LogIn, LogOut, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/80 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between sm:h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative h-9 w-28 transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-32">
              <Image
                fill
                src="/images/logo.png"
                alt="Meta Cinema"
                sizes="128px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <Navbar />

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Auth Section */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-orange-500/20 transition-colors hover:border-orange-500/50">
                      <AvatarImage name={user.name} />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Trang cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 font-medium text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:from-orange-600 hover:to-orange-700">
                  <LogIn className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
                <div className="border-b px-6 py-5">
                  <p className="text-sm font-semibold text-orange-600">META CINEMA</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Khám phá phim và đặt vé nhanh
                  </p>
                </div>
                <div className="mt-2 flex flex-col gap-1 px-4">
                  <Link
                    href="/"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/posts"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Bài báo
                  </Link>
                  <Link
                    href="/events"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Sự kiện
                  </Link>
                  <Link
                    href="/combos"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Combos & Đồ ăn
                  </Link>
                  <Link
                    href="/ticket-prices"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Giá vé
                  </Link>
                  <Link
                    href="/ai-mode"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                  >
                    Đặt Vé Với AI
                  </Link>
                </div>

                <div className="mt-4 border-t px-4 py-4">
                  {isAuthenticated && user ? (
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/20"
                      >
                        <User className="h-4 w-4" />
                        Trang cá nhân
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <Link href="/auth/login" className="block">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                        <LogIn className="mr-2 h-4 w-4" />
                        Đăng nhập
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
