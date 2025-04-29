"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define product type
interface Product {
  id: string
  name: string
  status: string
  shipping: string
  price: string
  priceValue?: number
  negotiable: string
  description?: string
}

export function ActiveProductsTable() {
  // Sample data matching the screenshot with added fields for filtering
  const allProducts: Product[] = [
    {
      id: "1",
      name: "Scrap Metal",
      status: "paid",
      shipping: "In Progress",
      price: "1000.00 DA",
      priceValue: 1000,
      negotiable: "YES",
      description: "Metal recycling materials for industrial use",
    },
    {
      id: "TASK-7878",
      name: "Iron Sheets",
      status: "paid",
      shipping: "shipped",
      price: "1500.00 DA",
      priceValue: 1500,
      negotiable: "NO",
      description: "Plastic waste collection for recycling",
    },
    {
      id: "TASK-7839",
      name: "Copper Wire",
      status: "paid",
      shipping: "shipped",
      price: "2500.00 DA",
      priceValue: 2500,
      negotiable: "YES",
      description: "Electronic components for reuse",
    },
    {
      id: "TASK-5562",
      name: "Aluminum Profiles",
      status: "pending",
      shipping: "In Progress",
      price: "800.00 DA",
      priceValue: 800,
      negotiable: "NO",
      description: "Paper waste for recycling process",
    },
    {
      id: "TASK-4421",
      name: "Steel Coils",
      status: "active",
      shipping: "express",
      price: "3000.00 DA",
      priceValue: 3000,
      negotiable: "YES",
      description: "Glass materials for industrial recycling",
    },
    {
      id: "TASK-3318",
      name: "Plastic Scraps",
      status: "inactive",
      shipping: "standard",
      price: "1200.00 DA",
      priceValue: 1200,
      negotiable: "NO",
      description: "Textile waste for repurposing",
    },
  ]

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [shippingFilter, setShippingFilter] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<string[]>([])
  const [negotiableFilter, setNegotiableFilter] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const pageSizeOptions = [5, 10, 15, 20]

  // Filter products based on search query and selected filters
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.status.toLowerCase().includes(query) ||
          product.shipping.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(product.status.toLowerCase())) {
        return false
      }

      // Shipping filter
      if (shippingFilter.length > 0 && !shippingFilter.includes(product.shipping.toLowerCase())) {
        return false
      }

      // Price filter
      if (priceFilter.length > 0) {
        const price = product.priceValue || 0
        let matchesPrice = false

        for (const range of priceFilter) {
          if (range === "under-1000" && price < 1000) matchesPrice = true
          else if (range === "1000-2000" && price >= 1000 && price <= 2000) matchesPrice = true
          else if (range === "over-2000" && price > 2000) matchesPrice = true
        }

        if (!matchesPrice) return false
      }

      // Negotiable filter
      if (negotiableFilter.length > 0) {
        const isNegotiable = product.negotiable === "YES"
        if (negotiableFilter.includes("negotiable") && !isNegotiable) return false
        if (negotiableFilter.includes("not-negotiable") && isNegotiable) return false
      }

      return true
    })
  }, [allProducts, searchQuery, statusFilter, shippingFilter, priceFilter, negotiableFilter])

  // Calculate pagination
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentItems = filteredProducts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, shippingFilter, priceFilter, negotiableFilter])

  // Helper function to render shipping status badge
  const getShippingBadge = (shipping: string) => {
    switch (shipping.toLowerCase()) {
      case "in progress":
        return (
          <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
        >
          In Progress
        </Badge>
        )
      case "shipped":
        return (
          <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
        >
          Shipped
        </Badge>
        )
      case "express":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          >
           Express
          </Badge>
        )
      case "standard":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 hover:bg-orange-50 border-orange-200 flex items-center gap-1"
          >
            <div className="h-2 w-2 rounded-full bg-orange-500 mr-1"></div>
            Standard
          </Badge>
        )
      default:
        return shipping
    }
  }

  // Pagination controls component
  const PaginationControls = () => {
    const pageNumbers = []
    const maxPageButtons = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>
            Showing {startIndex + 1}-{endIndex} of {totalItems} items
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Go to first page"
              >
                1
              </button>
              {startPage > 2 && <span className="inline-flex h-8 w-8 items-center justify-center">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                currentPage === page
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="inline-flex h-8 w-8 items-center justify-center">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Go to last page"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Active Products</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-[200px] sm:w-[250px] h-8 mr-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={statusFilter.length > 0 ? statusFilter[0] : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setStatusFilter([])
                } else {
                  setStatusFilter([value])
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={shippingFilter.length > 0 ? shippingFilter[0] : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setShippingFilter([])
                } else {
                  setShippingFilter([value])
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Shipping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Shipping</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priceFilter.length > 0 ? priceFilter[0] : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setPriceFilter([])
                } else {
                  setPriceFilter([value])
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Price</SelectItem>
                <SelectItem value="under-1000">Under 1000 DA</SelectItem>
                <SelectItem value="1000-2000">1000-2000 DA</SelectItem>
                <SelectItem value="over-2000">Over 2000 DA</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={negotiableFilter.length > 0 ? negotiableFilter[0] : "all"}
              onValueChange={(value) => {
                if (value === "all") {
                  setNegotiableFilter([])
                } else {
                  setNegotiableFilter([value])
                }
              }}
            >
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Negotiable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Negotiable</SelectItem>
                <SelectItem value="negotiable">yes</SelectItem>
                <SelectItem value="not-negotiable">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Shipping</TableHead>
              <TableHead className="text-xs">Price</TableHead>
              <TableHead className="text-xs">Negotiable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>{getShippingBadge(product.shipping)}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.negotiable}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filteredProducts.length > 0 && <PaginationControls />}
      </CardContent>
    </Card>
  )
}

