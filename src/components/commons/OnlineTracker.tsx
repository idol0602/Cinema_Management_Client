"use client"

import { useOnline } from "@/hooks/useOnline"
import { useAuthStore } from "@/store/useAuthStore"

export function OnlineTracker() {
  const { isAuthenticated } = useAuthStore()
  useOnline(isAuthenticated)
  return null
}
