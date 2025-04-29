"use client"

import { useState } from "react"
import { Bell, Check, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications, type NotificationType } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getFilteredNotifications,
  } = useNotifications()

  const [activeTab, setActiveTab] = useState<string>("all")

  // Get notifications based on active tab
  const getNotificationsForTab = () => {
    if (activeTab === "all") return notifications
    return getFilteredNotifications(activeTab as NotificationType)
  }

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "product_new":
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "product_update":
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
      case "order_status":
        return <div className="h-2 w-2 rounded-full bg-purple-500" />
      case "order_new":
        return <div className="h-2 w-2 rounded-full bg-yellow-500" />
      case "payment":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      case "system":
        return <div className="h-2 w-2 rounded-full bg-gray-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-primary" />
    }
  }

  // Format notification timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If it's today, show relative time (e.g., "2 hours ago")
    if (date.toDateString() === now.toDateString()) {
      return formatDistanceToNow(date, { addSuffix: true })
    }

    // If it's within the last week, show day and time
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(date, "EEEE 'at' h:mm a")
    }

    // Otherwise, show full date
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-8 w-8" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={markAllAsRead}>
                <Check className="mr-1 h-3.5 w-3.5" />
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                onClick={clearAllNotifications}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-1">
            <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="product_new"
                className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="order_status"
                className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                System
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="focus-visible:outline-none">
            <ScrollArea className="h-[300px]">
              {getNotificationsForTab().length > 0 ? (
                <div className="flex flex-col">
                  {getNotificationsForTab().map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "relative flex gap-3 border-b p-4 hover:bg-muted/50",
                        !notification.read && "bg-muted/30",
                      )}
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 rounded-full"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</p>

                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => {
                              markAsRead(notification.id)
                              // In a real app, we would use router.push here
                              window.location.href = notification.actionUrl!
                            }}
                          >
                            View details
                          </Button>
                        )}

                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-6 w-6 rounded-full p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6">
                  <Bell className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-center text-sm font-medium text-muted-foreground">No notifications</p>
                  <p className="text-center text-xs text-muted-foreground">
                    When you receive notifications, they'll appear here.
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <div className="p-3 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // Close the dropdown and navigate to notifications page
              document.body.click() // This will close the dropdown
              window.location.href = "/notifications"
            }}
          >
            See all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

