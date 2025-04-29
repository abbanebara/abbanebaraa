"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Check, Trash2 } from "lucide-react"
import { useNotifications, type NotificationType } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { NotificationDemo } from "@/components/notification-demo"

export function NotificationsPage() {
  const {
    notifications,
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
        return <div className="h-3 w-3 rounded-full bg-green-500" />
      case "product_update":
        return <div className="h-3 w-3 rounded-full bg-blue-500" />
      case "order_status":
        return <div className="h-3 w-3 rounded-full bg-purple-500" />
      case "order_new":
        return <div className="h-3 w-3 rounded-full bg-yellow-500" />
      case "payment":
        return <div className="h-3 w-3 rounded-full bg-red-500" />
      case "system":
        return <div className="h-3 w-3 rounded-full bg-gray-500" />
      default:
        return <div className="h-3 w-3 rounded-full bg-primary" />
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
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          View and manage your notifications. You can filter by type and mark notifications as read.
        </p>
      </div>

      <div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between border-b">
            <TabsList className="h-10 justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="product_new"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="order_status"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Payments
              </TabsTrigger>
              <TabsTrigger
                value="system"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                System
              </TabsTrigger>
            </TabsList>
            {notifications.length > 0 && (
              <div className="flex items-center gap-2 pr-2">
                <Button variant="ghost" size="sm" className="h-8" onClick={markAllAsRead}>
                  <Check className="mr-1 h-4 w-4" />
                  Mark all as read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={clearAllNotifications}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <TabsContent value={activeTab} className="mt-4 focus-visible:outline-none">
            {getNotificationsForTab().length > 0 ? (
              <div className="space-y-4">
                {getNotificationsForTab().map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "relative flex gap-4 rounded-lg border p-4 hover:bg-muted/50",
                      !notification.read && "bg-muted/30",
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 rounded-full p-0"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => clearNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between pt-1">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Trash2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  You don't have any {activeTab !== "all" ? activeTab.replace("_", " ") : ""} notifications at the
                  moment.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <NotificationDemo />
      </div>
    </div>
  )
}
