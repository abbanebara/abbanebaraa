"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import Footer from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // List of specific pages where header, footer, and navigation should be removed
  const pagesWithoutHeaderFooter = [
    "/overview",
    "/products",
    "/products/edit",
    "/products/create",
    "/products/view/[id]",
    "/products/view",
    "/products/edit",
    "/products/add",
    "/products/view/id",
    "/requests",
    "/buyer",
    "/buyer/orders",
    "/buyer/history",
    "/buyer/favorites",
    "/buyer/favorite-sellers",
    "/buyer/cart",
    "/profile",
    "/organization",
    "/notifications",
    "/admin",
    "/admin/users",
    "/admin/organization",
    "/admin/offers",
    "/admin/requests",
    "/admin/responses",
  ]

  // List of path patterns that should not have header, footer, and navigation
  const pathPatternsWithoutHeaderFooter = ["/products/edit/", "/products/view/", "/products/add/", "/products/view/id"]


  // Check if current path is in the list of pages without header/footer
  // or if it starts with any of the patterns in pathPatternsWithoutHeaderFooter
  const shouldHideHeaderFooter =
    pagesWithoutHeaderFooter.includes(pathname) ||
    pathPatternsWithoutHeaderFooter.some((pattern) => pathname.startsWith(pattern))

  if (shouldHideHeaderFooter) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
