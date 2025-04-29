"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarAdmin } from "@/components/admin/sidebar-admin"
import { SidebarToggleAdmin } from "@/components/admin/sidebar-toggle-admin"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Check if we're on mobile and auto-collapse sidebar
  const [isMobile, setIsMobile] = useState(false)

  // Add useEffect to handle mobile detection and auto-collapse
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Set up listener for window resize
    window.addEventListener("resize", checkMobile)

    // Auto-collapse on mobile
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }

    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const pathname = usePathname()

  // Function to get the current page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview"
    if (pathname === "/admin/users") return "Users"
    if (pathname === "/admin/organization") return "Organization"
    if (pathname === "/admin/offers") return "Offers"
    if (pathname === "/admin/requests") return "Requests"
    if (pathname === "/admin/responses") return "Responses"
    if (pathname === "/admin/orders") return "Orders"
    if (pathname === "/admin/scrap") return "Scrap"
    if (pathname === "/admin/unit") return "Unit"
    if (pathname === "/admin/categories") return "Categories"
    if (pathname === "/admin/subcategories") return "Subcategories"
    if (pathname === "/admin/admins") return "Admins"
    if (pathname === "/admin/roles") return "Roles"
    if (pathname === "/admin/permissions") return "Permissions"
    if (pathname === "/admin/blogs") return "Blogs"
    if (pathname === "/admin/ads") return "Ads"
    if (pathname === "/admin/events") return "Events"
    if (pathname === "/admin/carousel") return "Carousel"
    if (pathname === "/admin/services") return "Services"

    return "Overview"
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev)
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen bg-white relative">
            <SidebarAdmin collapsed={sidebarCollapsed} />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <header className="flex items-center justify-between h-16 border-b px-4">
                <div className="flex items-center">
                  <SidebarToggleAdmin collapsed={sidebarCollapsed} onClick={toggleSidebar} />
                  <div className="h-6 border-l mx-4"></div>
                  <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium">Bilgreen admin</div>
                      <div className="text-xs text-muted-foreground">Admin</div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>BA</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </header>
              <main className="p-6">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
