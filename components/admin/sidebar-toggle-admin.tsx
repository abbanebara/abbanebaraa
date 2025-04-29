"use client"

import { PanelLeft, PanelRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarToggleProps {
  collapsed: boolean
  onClick: () => void
}

export function SidebarToggleAdmin({ collapsed, onClick }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-8 rounded-full hover:bg-gray-50 text-gray-700 transition-colors"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
    </Button>
  )
}
