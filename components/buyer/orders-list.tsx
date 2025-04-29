"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Clock, Package, Truck, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define order type for better type safety
type OrderStatus = "Processing" | "In Progress" | "Shipped" | "Delivered" | "Cancelled"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  image: string
}

interface ShippingAddress {
  fullName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

interface Order {
  id: string
  productName: string
  category: string
  description: string
  time: string
  status: OrderStatus
  item?: OrderItem // Changed from items?: OrderItem[]
  totalAmount?: number
  shippingAddress?: ShippingAddress
  paymentMethod?: string
  trackingNumber?: string
  estimatedDelivery?: string
  statusHistory?: {
    status: OrderStatus
    timestamp: string
    note?: string
  }[]
}

export function OrdersList() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active")
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Pagination state
  const [currentActivePage, setCurrentActivePage] = useState(1)
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1)
  const itemsPerPage = 5

  // Sample data with expanded order information
  const [activeOrders, setActiveOrders] = useState<Order[]>([
    {
      id: "1",
      productName: "Recycled Metal Collection",
      category: "Metal Recycling",
      description: "Bulk order of assorted metal scraps for recycling",
      time: "10:52 pm",
      status: "In Progress",
      item: {
        id: "item1",
        name: "Aluminum Scraps",
        quantity: 2,
        price: 5000,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 10000,
      shippingAddress: {
        fullName: "Ahmed Benali",
        street: "123 Recycling Avenue",
        city: "Algiers",
        state: "Algiers Province",
        postalCode: "16000",
        country: "Algeria",
        phone: "+213 555 123 456",
      },
      paymentMethod: "Bank Transfer",
      estimatedDelivery: "March 25, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 15, 2025 09:30 AM", note: "Order received" },
        { status: "In Progress", timestamp: "March 16, 2025 02:15 PM", note: "Processing started" },
      ],
    },
    {
      id: "2",
      productName: "Industrial Plastic Waste",
      category: "Plastic Recycling",
      description: "Clean industrial plastic waste for recycling process",
      time: "11:20 am",
      status: "Processing",
      item: {
        id: "item3",
        name: "HDPE Containers",
        quantity: 3,
        price: 3000,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 9000,
      shippingAddress: {
        fullName: "Fatima Zahra",
        street: "456 Green Street",
        city: "Oran",
        state: "Oran Province",
        postalCode: "31000",
        country: "Algeria",
        phone: "+213 555 789 012",
      },
      paymentMethod: "Credit Card",
      estimatedDelivery: "March 28, 2025",
      statusHistory: [{ status: "Processing", timestamp: "March 17, 2025 10:45 AM", note: "Order received" }],
    },
    {
      id: "3",
      productName: "Electronic Waste Collection",
      category: "E-Waste",
      description: "Collection of electronic components for specialized recycling",
      time: "09:15 am",
      status: "Shipped",
      item: {
        id: "item5",
        name: "Circuit Boards",
        quantity: 10,
        price: 2000,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 20000,
      shippingAddress: {
        fullName: "Karim Boudiaf",
        street: "789 Tech Boulevard",
        city: "Constantine",
        state: "Constantine Province",
        postalCode: "25000",
        country: "Algeria",
        phone: "+213 555 345 678",
      },
      paymentMethod: "Mobile Payment",
      trackingNumber: "ALG-ECO-78945612",
      estimatedDelivery: "March 22, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 14, 2025 08:30 AM", note: "Order received" },
        { status: "In Progress", timestamp: "March 15, 2025 01:45 PM", note: "Processing started" },
        { status: "Shipped", timestamp: "March 16, 2025 11:20 AM", note: "Package dispatched" },
      ],
    },
    {
      id: "4",
      productName: "Paper and Cardboard Waste",
      category: "Paper Recycling",
      description: "Mixed paper and cardboard materials for pulping",
      time: "02:40 pm",
      status: "In Progress",
      item: {
        id: "item7",
        name: "Office Paper",
        quantity: 15,
        price: 500,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 7500,
      shippingAddress: {
        fullName: "Amina Khelif",
        street: "321 Paper Mill Road",
        city: "Annaba",
        state: "Annaba Province",
        postalCode: "23000",
        country: "Algeria",
        phone: "+213 555 901 234",
      },
      paymentMethod: "Cash on Delivery",
      estimatedDelivery: "March 24, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 16, 2025 02:30 PM", note: "Order received" },
        { status: "In Progress", timestamp: "March 17, 2025 09:15 AM", note: "Processing started" },
      ],
    },
    {
      id: "5",
      productName: "Organic Waste Collection",
      category: "Organic Recycling",
      description: "Organic waste for composting and biogas production",
      time: "08:30 am",
      status: "Processing",
      item: {
        id: "item9",
        name: "Food Waste",
        quantity: 50,
        price: 200,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 10000,
      shippingAddress: {
        fullName: "Youcef Hamdi",
        street: "567 Green Lane",
        city: "Blida",
        state: "Blida Province",
        postalCode: "09000",
        country: "Algeria",
        phone: "+213 555 234 567",
      },
      paymentMethod: "Bank Transfer",
      estimatedDelivery: "March 20, 2025",
      statusHistory: [{ status: "Processing", timestamp: "March 18, 2025 08:30 AM", note: "Order received" }],
    },
    {
      id: "6",
      productName: "Construction Waste",
      category: "Construction Recycling",
      description: "Demolition and construction waste materials",
      time: "03:15 pm",
      status: "In Progress",
      item: {
        id: "item11",
        name: "Concrete Debris",
        quantity: 100,
        price: 150,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 15000,
      shippingAddress: {
        fullName: "Omar Bensalem",
        street: "789 Construction Avenue",
        city: "Batna",
        state: "Batna Province",
        postalCode: "05000",
        country: "Algeria",
        phone: "+213 555 678 901",
      },
      paymentMethod: "Cash on Delivery",
      estimatedDelivery: "March 30, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 15, 2025 03:15 PM", note: "Order received" },
        { status: "In Progress", timestamp: "March 16, 2025 10:30 AM", note: "Processing started" },
      ],
    },
  ])

  const [completedOrders, setCompletedOrders] = useState<Order[]>([
    {
      id: "7",
      productName: "Glass Recycling Batch",
      category: "Glass Recycling",
      description: "Sorted glass waste for recycling facility",
      time: "Yesterday",
      status: "Delivered",
      item: {
        id: "item13",
        name: "Clear Glass",
        quantity: 25,
        price: 200,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 5000,
      shippingAddress: {
        fullName: "Mohammed Larbi",
        street: "654 Glass Factory Lane",
        city: "Setif",
        state: "Setif Province",
        postalCode: "19000",
        country: "Algeria",
        phone: "+213 555 567 890",
      },
      paymentMethod: "Bank Transfer",
      trackingNumber: "ALG-ECO-45678923",
      estimatedDelivery: "March 15, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 10, 2025 10:30 AM", note: "Order received" },
        { status: "In Progress", timestamp: "March 11, 2025 01:15 PM", note: "Processing started" },
        { status: "Shipped", timestamp: "March 12, 2025 09:45 AM", note: "Package dispatched" },
        { status: "Delivered", timestamp: "March 15, 2025 02:30 PM", note: "Package delivered" },
      ],
    },
    {
      id: "8",
      productName: "Textile Waste Collection",
      category: "Textile Recycling",
      description: "Used textiles and fabrics for recycling and repurposing",
      time: "Last week",
      status: "Delivered",
      item: {
        id: "item15",
        name: "Cotton Materials",
        quantity: 30,
        price: 150,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 4500,
      shippingAddress: {
        fullName: "Leila Brahimi",
        street: "987 Textile Avenue",
        city: "Tlemcen",
        state: "Tlemcen Province",
        postalCode: "13000",
        country: "Algeria",
        phone: "+213 555 678 901",
      },
      paymentMethod: "Mobile Payment",
      trackingNumber: "ALG-ECO-32165498",
      estimatedDelivery: "March 10, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 5, 2025 11:30 AM", note: "Order received" },
        { status: "In Progress", timestamp: "March 6, 2025 02:45 PM", note: "Processing started" },
        { status: "Shipped", timestamp: "March 7, 2025 10:15 AM", note: "Package dispatched" },
        { status: "Delivered", timestamp: "March 10, 2025 03:20 PM", note: "Package delivered" },
      ],
    },
    {
      id: "9",
      productName: "Battery Recycling",
      category: "Hazardous Waste",
      description: "Used batteries for proper disposal and recycling",
      time: "2 weeks ago",
      status: "Delivered",
      item: {
        id: "item17",
        name: "Lithium Batteries",
        quantity: 100,
        price: 50,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 5000,
      shippingAddress: {
        fullName: "Nadir Bouaziz",
        street: "123 Environmental Street",
        city: "Biskra",
        state: "Biskra Province",
        postalCode: "07000",
        country: "Algeria",
        phone: "+213 555 123 789",
      },
      paymentMethod: "Credit Card",
      trackingNumber: "ALG-ECO-98765432",
      estimatedDelivery: "March 5, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "March 1, 2025 09:00 AM", note: "Order received" },
        { status: "In Progress", timestamp: "March 2, 2025 11:30 AM", note: "Processing started" },
        { status: "Shipped", timestamp: "March 3, 2025 02:15 PM", note: "Package dispatched" },
        { status: "Delivered", timestamp: "March 5, 2025 10:45 AM", note: "Package delivered" },
      ],
    },
    {
      id: "10",
      productName: "Plastic Bottle Collection",
      category: "Plastic Recycling",
      description: "PET bottles for recycling into new products",
      time: "3 weeks ago",
      status: "Cancelled",
      item: {
        id: "item19",
        name: "Clear PET Bottles",
        quantity: 500,
        price: 10,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 5000,
      shippingAddress: {
        fullName: "Samira Hadj",
        street: "456 Recycling Boulevard",
        city: "Djelfa",
        state: "Djelfa Province",
        postalCode: "17000",
        country: "Algeria",
        phone: "+213 555 456 789",
      },
      paymentMethod: "Bank Transfer",
      statusHistory: [
        { status: "Processing", timestamp: "February 25, 2025 08:30 AM", note: "Order received" },
        { status: "Cancelled", timestamp: "February 26, 2025 03:45 PM", note: "Order cancelled by customer" },
      ],
    },
    {
      id: "11",
      productName: "Scrap Metal Collection",
      category: "Metal Recycling",
      description: "Mixed scrap metal for industrial recycling",
      time: "Last month",
      status: "Delivered",
      item: {
        id: "item21",
        name: "Iron Scrap",
        quantity: 200,
        price: 30,
        image: "/placeholder.svg?height=80&width=80",
      },
      totalAmount: 6000,
      shippingAddress: {
        fullName: "Kamel Messaoudi",
        street: "789 Industrial Zone",
        city: "Bejaia",
        state: "Bejaia Province",
        postalCode: "06000",
        country: "Algeria",
        phone: "+213 555 789 012",
      },
      paymentMethod: "Cash on Delivery",
      trackingNumber: "ALG-ECO-12345678",
      estimatedDelivery: "February 20, 2025",
      statusHistory: [
        { status: "Processing", timestamp: "February 15, 2025 10:15 AM", note: "Order received" },
        { status: "In Progress", timestamp: "February 16, 2025 01:30 PM", note: "Processing started" },
        { status: "Shipped", timestamp: "February 17, 2025 09:45 AM", note: "Package dispatched" },
        { status: "Delivered", timestamp: "February 20, 2025 11:30 AM", note: "Package delivered" },
      ],
    },
  ])

  // State for managing dialogs
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [editedOrder, setEditedOrder] = useState<Order | null>(null)

  // Calculate total orders for display in UI components
  const totalOrders = activeOrders.length + completedOrders.length

  // Make the order counts available for other components via localStorage
  // This allows the sidebar to access this information
  useEffect(() => {
    // Calculate total spending from active and completed orders
    const calculateTotalSpending = () => {
      let total = 0

      // Add up totals from active orders
      activeOrders.forEach((order) => {
        if (order.totalAmount) {
          total += order.totalAmount
        }
      })

      // Add up totals from completed orders
      completedOrders.forEach((order) => {
        if (order.totalAmount && order.status === "Delivered") {
          total += order.totalAmount
        }
      })

      return total
    }

    const totalSpending = calculateTotalSpending()

    // Determine if spending is trending up or down (in a real app, this would compare to previous periods)
    // For demo purposes, we'll say it's trending up if there are more active orders than completed
    const spendingTrend = activeOrders.length > completedOrders.length ? "up" : "down"

    // Calculate a percentage change (simulated for demo)
    const spendingPercentage = spendingTrend === "up" ? 12.5 : 8.3

    // Store the counts in localStorage for access by other components
    localStorage.setItem(
      "orderCounts",
      JSON.stringify({
        total: totalOrders,
        active: activeOrders.length,
        completed: completedOrders.length,
        sidebarBadge: activeOrders.length,
        totalSpending: totalSpending,
        spendingTrend: spendingTrend,
        spendingPercentage: spendingPercentage,
      }),
    )

    // Dispatch a custom event to notify other components of the change
    const orderCountEvent = new CustomEvent("orderCountsUpdated", {
      detail: {
        total: totalOrders,
        active: activeOrders.length,
        completed: completedOrders.length,
        sidebarBadge: activeOrders.length,
        totalSpending: totalSpending,
        spendingTrend: spendingTrend,
        spendingPercentage: spendingPercentage,
      },
    })
    window.dispatchEvent(orderCountEvent)

    // Clean up when component unmounts
    return () => {
      // Keep the data in localStorage for persistence
    }
  }, [totalOrders, activeOrders.length, completedOrders.length, activeOrders, completedOrders])

  // Function to handle order cancellation
  const handleCancelOrder = () => {
    if (!selectedOrder) return

    // Update active orders list
    const updatedActiveOrders = activeOrders.filter((order) => order.id !== selectedOrder.id)

    // Add to completed orders with cancelled status
    const cancelledOrder = {
      ...selectedOrder,
      status: "Cancelled" as OrderStatus,
      statusHistory: [
        ...(selectedOrder.statusHistory || []),
        {
          status: "Cancelled",
          timestamp: new Date().toLocaleString(),
          note: "Order cancelled by user",
        },
      ],
    }

    setCompletedOrders([cancelledOrder, ...completedOrders])
    setActiveOrders(updatedActiveOrders)
    setIsCancelDialogOpen(false)
    setSelectedOrder(null)

    // Calculate new spending total after cancellation
    const calculateNewTotalSpending = () => {
      let total = 0

      // Add up totals from active orders (excluding the cancelled one)
      updatedActiveOrders.forEach((order) => {
        if (order.totalAmount) {
          total += order.totalAmount
        }
      })

      // Add up totals from completed orders (including the newly cancelled one)
      // Note: Cancelled orders don't contribute to spending
      ;[...completedOrders, cancelledOrder].forEach((order) => {
        if (order.totalAmount && order.status === "Delivered") {
          total += order.totalAmount
        }
      })

      return total
    }

    const newTotalSpending = calculateNewTotalSpending()

    // Immediately update the order counts in localStorage and dispatch event
    const newActiveCount = updatedActiveOrders.length
    const newCompletedCount = completedOrders.length + 1
    const newTotal = newActiveCount + newCompletedCount

    // Determine trend based on cancellation (usually cancelling reduces spending)
    const spendingTrend = "down"
    const spendingPercentage = 8.3

    localStorage.setItem(
      "orderCounts",
      JSON.stringify({
        total: newTotal,
        active: newActiveCount,
        completed: newCompletedCount,
        sidebarBadge: newActiveCount,
        totalSpending: newTotalSpending,
        spendingTrend: spendingTrend,
        spendingPercentage: spendingPercentage,
      }),
    )

    // Dispatch event for real-time updates
    const orderCountEvent = new CustomEvent("orderCountsUpdated", {
      detail: {
        total: newTotal,
        active: newActiveCount,
        completed: newCompletedCount,
        sidebarBadge: newActiveCount,
        totalSpending: newTotalSpending,
        spendingTrend: spendingTrend,
        spendingPercentage: spendingPercentage,
      },
    })
    window.dispatchEvent(orderCountEvent)
  }

  // Function to handle order editing
  const handleEditOrder = () => {
    if (!editedOrder || !selectedOrder) return

    // Check if the order is moving between active and completed states
    const wasActive = activeOrders.some((order) => order.id === selectedOrder.id)
    const willBeActive = !["Delivered", "Cancelled"].includes(editedOrder.status)
    const statusChanged = wasActive !== willBeActive

    // Update the order in the appropriate list
    if (wasActive && !willBeActive) {
      // Moving from active to completed
      const updatedActiveOrders = activeOrders.filter((order) => order.id !== selectedOrder.id)
      const updatedOrder = {
        ...editedOrder,
        statusHistory: [
          ...(selectedOrder.statusHistory || []),
          {
            status: editedOrder.status,
            timestamp: new Date().toLocaleString(),
            note: "Order status updated to " + editedOrder.status,
          },
        ],
      }

      setActiveOrders(updatedActiveOrders)
      setCompletedOrders([updatedOrder, ...completedOrders])

      // Update counts immediately
      if (statusChanged) {
        const newActiveCount = updatedActiveOrders.length
        const newCompletedCount = completedOrders.length + 1

        localStorage.setItem(
          "orderCounts",
          JSON.stringify({
            total: newActiveCount + newCompletedCount,
            active: newActiveCount,
            completed: newCompletedCount,
            sidebarBadge: newActiveCount,
          }),
        )

        window.dispatchEvent(
          new CustomEvent("orderCountsUpdated", {
            detail: {
              total: newActiveCount + newCompletedCount,
              active: newActiveCount,
              completed: newCompletedCount,
              sidebarBadge: newActiveCount,
            },
          }),
        )
      }
    } else if (!wasActive && willBeActive) {
      // Moving from completed to active
      const updatedCompletedOrders = completedOrders.filter((order) => order.id !== selectedOrder.id)
      const updatedOrder = {
        ...editedOrder,
        statusHistory: [
          ...(selectedOrder.statusHistory || []),
          {
            status: editedOrder.status,
            timestamp: new Date().toLocaleString(),
            note: "Order status updated to " + editedOrder.status,
          },
        ],
      }

      setCompletedOrders(updatedCompletedOrders)
      setActiveOrders([...activeOrders, updatedOrder])

      // Update counts immediately
      if (statusChanged) {
        const newActiveCount = activeOrders.length + 1
        const newCompletedCount = updatedCompletedOrders.length

        localStorage.setItem(
          "orderCounts",
          JSON.stringify({
            total: newActiveCount + newCompletedCount,
            active: newActiveCount,
            completed: newCompletedCount,
            sidebarBadge: newActiveCount,
          }),
        )

        window.dispatchEvent(
          new CustomEvent("orderCountsUpdated", {
            detail: {
              total: newActiveCount + newCompletedCount,
              active: newActiveCount,
              completed: newCompletedCount,
              sidebarBadge: newActiveCount,
            },
          }),
        )
      }
    } else {
      // Status remains in the same category, just update the order
      const updatedActiveOrders = activeOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...editedOrder,
              statusHistory: [
                ...(order.statusHistory || []),
                {
                  status: editedOrder.status,
                  timestamp: new Date().toLocaleString(),
                  note: "Order details updated",
                },
              ],
            }
          : order,
      )

      setActiveOrders(updatedActiveOrders)
    }

    setIsEditDialogOpen(false)
    setSelectedOrder(null)
    setEditedOrder(null)
  }

  // Function to prepare for editing
  const prepareForEdit = (order: Order) => {
    setSelectedOrder(order)
    setEditedOrder({ ...order })
    setIsEditDialogOpen(true)
  }

  // Function to view order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsViewDialogOpen(true)
  }

  // Function to prepare for cancellation
  const prepareForCancel = (order: Order) => {
    setSelectedOrder(order)
    setIsCancelDialogOpen(true)
  }

  // Function to toggle expanded order details
  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  // Helper function to get status icon
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "In Progress":
        return <Package className="h-4 w-4 text-blue-500" />
      case "Shipped":
        return <Truck className="h-4 w-4 text-purple-500" />
      case "Delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Cancelled":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        )
      case "In Progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 flex items-center gap-1"
          >
            <Package className="h-3 w-3" />
            In Progress
          </Badge>
        )
      case "Shipped":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200 flex items-center gap-1"
          >
            <Truck className="h-3 w-3" />
            Shipped
          </Badge>
        )
      case "Delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Delivered
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return status
    }
  }

  // Filter orders based on search query and status filter
  const filteredActiveOrders = activeOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredCompletedOrders = completedOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate pagination
  const totalActivePages = Math.ceil(filteredActiveOrders.length / itemsPerPage)
  const totalCompletedPages = Math.ceil(filteredCompletedOrders.length / itemsPerPage)

  const paginatedActiveOrders = filteredActiveOrders.slice(
    (currentActivePage - 1) * itemsPerPage,
    currentActivePage * itemsPerPage,
  )

  const paginatedCompletedOrders = filteredCompletedOrders.slice(
    (currentCompletedPage - 1) * itemsPerPage,
    currentCompletedPage * itemsPerPage,
  )

  return (
    <div className="space-y-6">
      <div className="">
        <h2 className="text-2xl font-bold tracking-tight">Orders ({activeOrders.length + completedOrders.length})</h2>
        <p className="text-muted-foreground">
          Manage your orders and track their status • {activeOrders.length} active • {completedOrders.length} completed
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        defaultValue="active"
        className="space-y-4"
        onValueChange={(value) => {
          setActiveTab(value as "active" | "completed")
          setExpandedOrderId(null)
        }}
      >
        <TabsList>
          <TabsTrigger value="active">Active Orders ({filteredActiveOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders ({filteredCompletedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {paginatedActiveOrders.length > 0 ? (
            <div className="grid gap-4">
              {paginatedActiveOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() => toggleOrderExpansion(order.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No active orders found</p>
            </div>
          )}

          {/* Pagination for active orders */}
          {totalActivePages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentActivePage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted">
                <span className="text-sm font-medium">
                  Page {currentActivePage} of {totalActivePages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentActivePage((prev) => Math.min(prev + 1, totalActivePages))}
                disabled={currentActivePage === totalActivePages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {paginatedCompletedOrders.length > 0 ? (
            <div className="grid gap-4">
              {paginatedCompletedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() => toggleOrderExpansion(order.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md bg-muted/10">
              <p className="text-muted-foreground">No completed orders found</p>
            </div>
          )}

          {/* Pagination for completed orders */}
          {totalCompletedPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentCompletedPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentCompletedPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-muted">
                <span className="text-sm font-medium">
                  Page {currentCompletedPage} of {totalCompletedPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentCompletedPage((prev) => Math.min(prev + 1, totalCompletedPages))}
                disabled={currentCompletedPage === totalCompletedPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
}: {
  order: Order
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  // Helper function to get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Processing":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <Package className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Shipped":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        )
      case "Delivered":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return status
    }
  }

  return (
    <div className="space-y-2">
      {/* Main Order Card */}
      <Card className="overflow-hidden transition-all duration-200">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">{order.productName}</CardTitle>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Category: {order.category}</p>
                <p className="text-sm text-muted-foreground">Order Date: {order.time}</p>
                {order.estimatedDelivery && (
                  <p className="text-sm text-muted-foreground">Estimated Delivery: {order.estimatedDelivery}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {order.totalAmount && <p className="font-medium">Total: {order.totalAmount.toLocaleString()} DA</p>}
                <Button variant="ghost" size="sm" onClick={onToggleExpand} className="flex items-center gap-1">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Hide Details</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>View Details</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview of item */}
            {order.item && (
              <div className="flex gap-2 overflow-x-auto py-2">
                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md overflow-hidden">
                  <Image
                    src={order.item.image || "/placeholder.svg"}
                    alt={order.item.name}
                    width={64}
                    height={64}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Card - Separate div element for order details */}
      {isExpanded && (
        <div
          className="overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-900 p-4 space-y-6 transition-all duration-300 animate-in fade-in-50"
          style={{ marginTop: "0.25rem" }}
        >
          {/* Order Item */}
          <div>
            <h3 className="text-md font-medium mb-3">Order Item</h3>
            <div className="space-y-3">
              {order.item && (
                <div className="flex items-center gap-3 p-3 border rounded-md bg-white dark:bg-gray-900">
                  <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0 ">
                    <Image
                      src={order.item.image || "/placeholder.svg"}
                      alt={order.item.name}
                      width={64}
                      height={64}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{order.item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {order.item.quantity} × {order.item.price.toLocaleString()} DA
                    </p>
                  </div>
                  <div className="text-right font-medium">
                    {(order.item.quantity * order.item.price).toLocaleString()} DA
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 text-right font-bold">Total: {order.totalAmount?.toLocaleString()} DA</div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div>
            <h3 className="text-md font-medium mb-3">Shipping Information</h3>
            {order.shippingAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border rounded-md bg-white dark:bg-gray-700">
                <div>
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                  <p className="text-sm">{order.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm">
                      <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Estimated Delivery:</span> {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3">Status History</h3>
              <div className="space-y-3 p-3 border rounded-md bg-white dark:bg-gray-700">
                {order.statusHistory?.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {history.status === "Processing" && <Clock className="h-4 w-4 text-yellow-500" />}
                      {history.status === "In Progress" && <Package className="h-4 w-4 text-blue-500" />}
                      {history.status === "Shipped" && <Truck className="h-4 w-4 text-purple-500" />}
                      {history.status === "Delivered" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {history.status === "Cancelled" && <X className="h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{history.status}</p>
                      <p className="text-sm text-muted-foreground">{history.timestamp}</p>
                      {history.note && <p className="text-sm">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
