"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import { Sidebar } from "./sidebar"
import { useSidebar } from "./sidebar-provider"
import { PanelLeft, PanelRight } from "lucide-react"
import { UserNav } from "./user-nav"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isOpen, toggle } = useSidebar()

  // Replace the getPageTitle function with this implementation that uses usePathname
  // instead of window.location.pathname

  const pathname = usePathname()

  // Extract the current page title from the URL path
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return "Overview"

    // Get the last segment and capitalize it
    const lastSegment = segments[segments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
  }

  return (
    <div className="relative min-h-screen bg-white">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 bg-white",
          isOpen ? "md:pl-[240px]" : "md:pl-[60px]",
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background">
          <div className="flex items-center h-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-14 rounded-full hover:bg-gray-50 text-gray-700 transition-colors"
              onClick={toggle}
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? <PanelLeft className="h-5 w-5" /> : <PanelRight className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl px-4">{getPageTitle()}</h1>
          </div>
          <div className="flex-1" />
          <div className="px-4">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
