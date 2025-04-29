"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, LineChart, ShoppingBag, ShieldCheck, Globe, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils-admin"

interface SidebarSection {
  title: string
  href?: string
  icon: React.ElementType
  active: boolean
  submenu?: {
    title: string
    href: string
    active: boolean
  }[]
}

interface SidebarProps {
  collapsed: boolean
}

export function SidebarAdmin({ collapsed }: SidebarProps) {
  const pathname = usePathname()

  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Manage users":
      pathname.includes("/admin/users") ||
      pathname.includes("/admin/organization") ||
      pathname.includes("/admin/offers"),
    Trading:
      pathname.includes("/admin/requests") ||
      pathname.includes("/admin/responses") ||
      pathname.includes("/admin/orders"),
    Market:
      pathname.includes("/admin/scrap") ||
      pathname.includes("/admin/unit") ||
      pathname.includes("/admin/categories") ||
      pathname.includes("/admin/subcategories"),
    Administration:
      pathname.includes("/admin/admins") ||
      pathname.includes("/admin/roles") ||
      pathname.includes("/admin/permissions"),
    "Web content":
      pathname.includes("/admin/blogs") ||
      pathname.includes("/admin/ads") ||
      pathname.includes("/admin/events") ||
      pathname.includes("/admin/carousel") ||
      pathname.includes("/admin/services"),
  })

  // Toggle section expanded state
  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const routes: SidebarSection[] = [
    {
      title: "Overview",
      href: "/admin",
      icon: BarChart3,
      active: pathname === "/admin",
    },
    {
      title: "Manage users",
      icon: Users,
      active:
        pathname.includes("/admin/users") ||
        pathname.includes("/admin/organization") ||
        pathname.includes("/admin/offers"),
      submenu: [
        {
          title: "Users",
          href: "/admin/users",
          active: pathname === "/admin/users",
        },
        {
          title: "Organization",
          href: "/admin/organization",
          active: pathname === "/admin/organization",
        },
        {
          title: "Offers",
          href: "/admin/offers",
          active: pathname === "/admin/offers",
        },
      ],
    },
    {
      title: "Trading",
      icon: LineChart,
      active:
        pathname.includes("/admin/requests") ||
        pathname.includes("/admin/responses") ||
        pathname.includes("/admin/orders"),
      submenu: [
        {
          title: "Requests",
          href: "/admin/requests",
          active: pathname === "/admin/requests",
        },
        {
          title: "Responses",
          href: "/admin/responses",
          active: pathname === "/admin/responses",
        },
        {
          title: "Orders",
          href: "/admin/orders",
          active: pathname === "/admin/orders",
        },
      ],
    },
    {
      title: "Market",
      icon: ShoppingBag,
      active:
        pathname.includes("/admin/scrap") ||
        pathname.includes("/admin/unit") ||
        pathname.includes("/admin/categories") ||
        pathname.includes("/admin/subcategories"),
      submenu: [
        {
          title: "Scrap",
          href: "/admin/scrap",
          active: pathname === "/admin/scrap",
        },
        {
          title: "Unit",
          href: "/admin/unit",
          active: pathname === "/admin/unit",
        },
        {
          title: "Categories",
          href: "/admin/categories",
          active: pathname === "/admin/categories",
        },
        {
          title: "Subcategories",
          href: "/admin/subcategories",
          active: pathname === "/admin/subcategories",
        },
      ],
    },
    {
      title: "Administration",
      icon: ShieldCheck,
      active:
        pathname.includes("/admin/admins") ||
        pathname.includes("/admin/roles") ||
        pathname.includes("/admin/permissions"),
      submenu: [
        {
          title: "Admins",
          href: "/admin/admins",
          active: pathname === "/admin/admins",
        },
        {
          title: "Roles",
          href: "/admin/roles",
          active: pathname === "/admin/roles",
        },
        {
          title: "Permissions",
          href: "/admin/permissions",
          active: pathname === "/admin/permissions",
        },
      ],
    },
    {
      title: "Web content",
      icon: Globe,
      active:
        pathname.includes("/admin/blogs") ||
        pathname.includes("/admin/ads") ||
        pathname.includes("/admin/events") ||
        pathname.includes("/admin/carousel") ||
        pathname.includes("/admin/services"),
      submenu: [
        {
          title: "Blogs",
          href: "/admin/blogs",
          active: pathname === "/admin/blogs",
        },
        {
          title: "Ads",
          href: "/admin/ads",
          active: pathname === "/admin/ads",
        },
        {
          title: "Events",
          href: "/admin/events",
          active: pathname === "/admin/events",
        },
        {
          title: "Carousel",
          href: "/admin/carousel",
          active: pathname === "/admin/carousel",
        },
        {
          title: "Services",
          href: "/admin/services",
          active: pathname === "/admin/services",
        },
      ],
    },
  ]

  return (
    <div
      className={cn(
        "border-r bg-gray-50 flex flex-col h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-20 min-w-20" : "w-[210px] min-w-[200px]",
      )}
    >
      <div className="p-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center justify-center">
            {collapsed ? "A" : "Admin"}
          </div>
          {!collapsed && <h1 className="font-bold text-lg">Dashboard</h1>}
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2 px-3">
        <nav className="grid gap-1">
          {routes.map((route, i) => (
            <div key={i}>
              {route.submenu ? (
                <>
                  <button
                    onClick={() => toggleSection(route.title)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 text-sm text-left rounded-full transition-colors",
                      collapsed && "justify-center px-2",
                      route.active ? "bg-gray-200" : "hover:bg-gray-200",
                      "text-gray-700",
                    )}
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    {!collapsed && (
                      <>
                        <span>{route.title}</span>
                        <span className="ml-auto">
                          {expandedSections[route.title] ? (
                            <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-500" />
                          )}
                        </span>
                      </>
                    )}
                  </button>
                  {expandedSections[route.title] && !collapsed && (
                    <div className="grid px-2 mt-1 gap-1">
                      {route.submenu.map((subItem, j) => (
                        <Link
                          key={j}
                          href={subItem.href}
                          className={cn(
                            "pl-10 py-2 text-sm rounded-full transition-colors",
                            subItem.active ? "bg-gray-200" : "hover:bg-gray-200",
                            "text-gray-700",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={route.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm rounded-full transition-colors",
                    collapsed && "justify-center px-2",
                    route.active ? "bg-gray-200" : "hover:bg-gray-200",
                    "text-gray-700",
                  )}
                  title={collapsed ? route.title : undefined}
                >
                  <route.icon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  {!collapsed && <span>{route.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
