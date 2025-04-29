"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
}

// Create the context with a default value that matches the shape
const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  toggle: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    if (!isMounted) return

    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [isMounted])

  const toggle = () => setIsOpen(!isOpen)

  return <SidebarContext.Provider value={{ isOpen, toggle }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  // We can still check if the context is being used properly
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

