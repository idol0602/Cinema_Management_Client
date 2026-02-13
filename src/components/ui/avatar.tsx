"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

// 👉 Hàm tạo màu ổn định từ string
function stringToColor(str: string) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 60%, 55%)`
}

// 👉 Lấy chữ cái đầu tiên
function getInitial(name: string) {
  if (!name) return "?"
  return name.trim().charAt(0).toUpperCase()
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = "Avatar"

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  name: string
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarImageProps
>(({ className, name, ...props }, ref) => {
  const initial = getInitial(name)
  const bgColor = stringToColor(name)

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full text-white font-semibold",
        className
      )}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      {initial}
    </AvatarPrimitive.Fallback>
  )
})
AvatarImage.displayName = "AvatarImage"

export { Avatar, AvatarImage }
