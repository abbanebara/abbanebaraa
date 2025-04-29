"use client"

import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { Package, ShoppingCart, CreditCard, AlertTriangle, Tag } from "lucide-react"

export function NotificationDemo() {
  const { addNotification, notifications, clearAllNotifications } = useNotifications()

  const generateProductNotification = () => {
    addNotification({
      type: "product_new",
      title: "New Product Available",
      message: "A new recycled metal collection is now available for purchase.",
      actionUrl: "/buyer/products",
      image: "/placeholder.svg",
    })
  }

  const generateOrderNotification = () => {
    addNotification({
      type: "order_status",
      title: "Order Status Updated",
      message: "Your order #38492 has been shipped and is on its way.",
      actionUrl: "/buyer/orders",
      image: "/placeholder.svg",
    })
  }

  const generatePaymentNotification = () => {
    addNotification({
      type: "payment",
      title: "Payment Successful",
      message: "Your payment of 15,000 DA has been processed successfully.",
      actionUrl: "/buyer/history",
    })
  }

  const generateSystemNotification = () => {
    addNotification({
      type: "system",
      title: "System Maintenance",
      message: "The system will be undergoing maintenance on March 25, 2025 from 2:00 AM to 4:00 AM.",
    })
  }

  const generatePriceDropNotification = () => {
    addNotification({
      type: "product_update",
      title: "Price Drop Alert",
      message: "A product in your favorites has dropped in price by 15%.",
      actionUrl: "/buyer/favorites",
    })
  }

  return (
    <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Notification Demo</h3>
          <p className="text-sm text-muted-foreground">
            Click the buttons below to generate notifications, then check the bell icon in the top right corner.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllNotifications} className="flex items-center gap-1">
            Clear All Notifications
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={generateProductNotification} className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          New Product
        </Button>
        <Button variant="outline" size="sm" onClick={generateOrderNotification} className="flex items-center gap-1">
          <Package className="h-4 w-4" />
          Order Update
        </Button>
        <Button variant="outline" size="sm" onClick={generatePaymentNotification} className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          Payment
        </Button>
        <Button variant="outline" size="sm" onClick={generateSystemNotification} className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          System Alert
        </Button>
        <Button variant="outline" size="sm" onClick={generatePriceDropNotification} className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4" />
          Price Drop
        </Button>
      </div>
    </div>
  )
}

