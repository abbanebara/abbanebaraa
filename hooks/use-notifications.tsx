"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type NotificationType = "product_new" | "product_update" | "order_status" | "order_new" | "payment" | "system"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  read: boolean
  actionUrl?: string
  image?: string
}

type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
  clearAllNotifications: () => void
  getFilteredNotifications: (type?: NotificationType) => Notification[]
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem("notifications")
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications)
        setNotifications(parsedNotifications)
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length)
      } else {
        // Initialize with empty array if no stored notifications
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Failed to parse notifications from localStorage:", error)
      setNotifications([])
      setUnreadCount(0)
    }
    setIsInitialized(true)
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("notifications", JSON.stringify(notifications))
      setUnreadCount(notifications.filter((n) => !n.read).length)
    }
  }, [notifications, isInitialized])

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Dispatch a custom event for real-time updates across tabs
    const notificationEvent = new CustomEvent("notificationAdded", {
      detail: { notification: newNotification },
    })
    window.dispatchEvent(notificationEvent)

    // Show browser notification if supported and permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }
  }

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear a specific notification
  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Get filtered notifications by type
  const getFilteredNotifications = (type?: NotificationType) => {
    if (!type) return notifications
    return notifications.filter((notification) => notification.type === type)
  }

  // Generate a unique ID for notifications
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Listen for notification events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "notifications") {
        try {
          const newNotifications = JSON.parse(e.newValue || "[]")
          setNotifications(newNotifications)
          setUnreadCount(newNotifications.filter((n: Notification) => !n.read).length)
        } catch (error) {
          console.error("Failed to parse notifications from storage event:", error)
        }
      }
    }

    const handleNotificationAdded = (e: CustomEvent) => {
      if (e.detail && e.detail.notification) {
        setNotifications((prev) => {
          // Avoid duplicates
          if (prev.some((n) => n.id === e.detail.notification.id)) {
            return prev
          }
          return [e.detail.notification, ...prev]
        })
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("notificationAdded", handleNotificationAdded as EventListener)

    // Request notification permission if not already granted
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("notificationAdded", handleNotificationAdded as EventListener)
    }
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        getFilteredNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

