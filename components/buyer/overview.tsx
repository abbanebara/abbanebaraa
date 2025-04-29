"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Clock, Heart, ShoppingCart, TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { ActiveProductsTable } from "./active-products-table"

export function BuyerOverview() {
  const [orderCounts, setOrderCounts] = useState({ total: 0, active: 0, completed: 0 })
  const [spending, setSpending] = useState({
    total: 45899.99,
    trend: "up",
    percentage: 12.5,
    period: "month",
  })

  useEffect(() => {
    const loadOrderCounts = () => {
      try {
        const storedCounts = localStorage.getItem("orderCounts")
        if (storedCounts) {
          setOrderCounts(JSON.parse(storedCounts))

          // In a real app, we would calculate the total spending from orders
          // For now, we'll use simulated data
          const counts = JSON.parse(storedCounts)
          if (counts.totalSpending) {
            setSpending((prev) => ({
              ...prev,
              total: counts.totalSpending,
              trend: counts.spendingTrend || "up",
              percentage: counts.spendingPercentage || 12.5,
            }))
          }
        }
      } catch (error) {
        console.error("Error loading order counts:", error)
      }
    }

    // Load initial counts
    loadOrderCounts()

    // Set up event listeners for both storage changes and custom events
    const handleStorageChange = () => loadOrderCounts()
    window.addEventListener("storage", handleStorageChange)

    // Listen for the custom event for real-time updates
    const handleOrderCountsUpdated = (event: CustomEvent) => {
      if (event.detail) {
        setOrderCounts(event.detail)

        // Update spending if available in the event
        if (event.detail.totalSpending) {
          setSpending((prev) => ({
            ...prev,
            total: event.detail.totalSpending,
            trend: event.detail.spendingTrend || prev.trend,
            percentage: event.detail.spendingPercentage || prev.percentage,
          }))
        }
      }
    }

    window.addEventListener("orderCountsUpdated", handleOrderCountsUpdated as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("orderCountsUpdated", handleOrderCountsUpdated as EventListener)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Buyer Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your buyer dashboard. View your recent purchases, track orders, and discover new products.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spending.total.toLocaleString()} DA</div>
            <div className="flex items-center text-xs">
              <span
                className={
                  spending.trend === "up" ? "text-green-500 flex items-center" : "text-red-500 flex items-center"
                }
              >
                {spending.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {spending.percentage}%
              </span>
              <span className="text-muted-foreground ml-1">from last {spending.period}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase History</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+3 in the last month</p>
          </CardContent>
          <CardFooter>
            <Link href="/buyer/history" className="text-xs text-muted-foreground hover:underline">
              View history <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites Sellers</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 with price drops</p>
          </CardContent>
          <CardFooter>
            <Link href="/buyer/favorite-sellers" className="text-xs text-muted-foreground hover:underline">
              View favorites sellers <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">$129.99 total</p>
          </CardContent>
          <CardFooter>
            <Link href="/buyer/cart" className="text-xs text-muted-foreground hover:underline">
              View cart <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Active Products Table */}
      <ActiveProductsTable />
    </div>
  )
}

