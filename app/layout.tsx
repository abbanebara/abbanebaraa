import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FavoritesProvider } from "@/hooks/use-favorites"
import { Toaster } from "@/components/ui/toaster"
import { NotificationsProvider } from "@/hooks/use-notifications"
import { SidebarProvider } from "@/components/sidebar-provider"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard",
  description: "A responsive dashboard application",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationsProvider>
          <FavoritesProvider>
            <SidebarProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
            </SidebarProvider>
          </FavoritesProvider>
        </NotificationsProvider>
      </body>
    </html>
  )
}

