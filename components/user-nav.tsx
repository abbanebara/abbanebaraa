"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationBell } from "@/components/notification-bell"
import { User, Building2, Globe, LogOut, ChevronRight } from "lucide-react"

export function UserNav() {
  const router = useRouter()
  const [showLanguages, setShowLanguages] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const languageButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target as Node)
      ) {
        setShowLanguages(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleOrganizationClick = () => {
    router.push("/organization")
  }

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language)
    setShowLanguages(false)
    // You can add i18n language switching logic here
    console.log("Selected language:", language)
  }

  const handleLogout = () => {
    console.log("Logging out...")
    // auth.signOut().then(() => router.push("/login"))
  }

  return (
    <div className="flex items-center gap-4">
      <NotificationBell />
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>SN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">My Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
              onClick={handleOrganizationClick}
            >
              <Building2 className="h-4 w-4" />
              <span className="font-medium">Organization</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <div ref={languageButtonRef}>
              <DropdownMenuItem
                className="flex items-center justify-between gap-2 px-3 py-2.5 cursor-pointer"
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">Language</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language dropdown */}
        {showLanguages && (
          <div
            ref={languageMenuRef}
            className="absolute top-0 right-full mr-2 bg-white border rounded-md shadow-md w-32 py-1 z-50"
          >
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleLanguageSelect("English")}
            >
              English
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleLanguageSelect("French")}
            >
              French
            </button>
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleLanguageSelect("Arabic")}
            >
              Arabic
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
