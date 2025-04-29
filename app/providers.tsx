"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/hooks/use-favorites"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/hooks/use-notifications"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NotificationsProvider>
        <FavoritesProvider>
          {children}
          <Toaster />
        </FavoritesProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}

