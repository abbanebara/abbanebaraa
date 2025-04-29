"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Download } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import * as XLSX from "xlsx"
import Link from "next/link"

// Define product type for better type safety
export interface Product {
  id: string
  name: string
  category: string
  status: string
  unit: string
  availableQuantity: string
  image: string
  price?: string
  description?: string
}

export function FavoritesList() {
  const { toast } = useToast()
  const { favorites, toggleFavorite, isInitialized } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Sample data - in a real app, this would come from an API
  const allProducts: Product[] = [
    {
      id: "1",
      name: "Scrap",
      category: "Mix scrap",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "10,000 DA",
      description: "Mixed metal scrap materials for recycling",
    },
    {
      id: "2",
      name: "Scrap",
      category: "Mix scrap",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "8,500 DA",
      description: "Assorted scrap materials from industrial sources",
    },
    {
      id: "3",
      name: "Iron and sheet",
      category: "Steel",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "15,000 DA",
      description: "High-quality iron sheets for industrial use",
    },
    {
      id: "4",
      name: "20 tons of silicone",
      category: "Steel coils",
      status: "Inspection",
      unit: "ton",
      availableQuantity: "20",
      image: "/placeholder.svg",
      price: "300,000 DA",
      description: "Industrial grade silicone materials in bulk quantity",
    },
    {
      id: "5",
      name: "Jumbo rims",
      category: "Rubber",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "25,000 DA",
      description: "Large rubber rims for heavy machinery",
    },
    {
      id: "6",
      name: "Filter",
      category: "Papers and Cartoon",
      status: "Inspection",
      unit: "ton",
      availableQuantity: "500",
      image: "/placeholder.svg",
      price: "7,500 DA",
      description: "Industrial filters for recycling and repurposing",
    },
    {
      id: "7",
      name: "Copper Wire",
      category: "Metal",
      status: "Available",
      unit: "kg",
      availableQuantity: "250",
      image: "/placeholder.svg",
      price: "35,000 DA",
      description: "High-quality copper wire for electrical applications",
    },
    {
      id: "8",
      name: "Aluminum Sheets",
      category: "Metal",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "22,000 DA",
      description: "Recycled aluminum sheets for manufacturing",
    },
  ]

  // Load products based on favorites
  useEffect(() => {
    if (isInitialized) {
      // Filter products that are in favorites
      const favoriteProducts =
        favorites.length > 0 ? allProducts.filter((product) => favorites.includes(product.id)) : []

      setProducts(favoriteProducts)
      setIsLoading(false)
    }
  }, [favorites, isInitialized])

  // Handle favorite toggle with animation and toast notification
  const handleFavoriteToggle = (product: Product) => {
    toggleFavorite(product.id)

    // Show toast notification
    toast({
      title: favorites.includes(product.id) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(product.id)
        ? `${product.name} has been removed from your favorites.`
        : `${product.name} has been added to your favorites.`,
      duration: 3000,
    })
  }

  // Handle request inspection
  const handleRequestInspection = (productId: string) => {
    toast({
      title: "Inspection Requested",
      description: "Your inspection request has been submitted successfully.",
      duration: 3000,
    })
  }

  // Function to export favorites to Excel
  const exportToExcel = () => {
    // Format data for export
    const dataToExport = products.map((product) => ({
      Name: product.name,
      Category: product.category,
      Status: product.status,
      Unit: product.unit,
      "Available Quantity": product.availableQuantity,
      Price: product.price || "N/A",
      Description: product.description || "N/A",
    }))

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Favorites")

    // Generate file name with current date
    const fileName = `favorites_${format(new Date(), "yyyy-MM-dd")}.xlsx`

    // Write and download
    XLSX.writeFile(workbook, fileName)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Favorites</h2>
          <p className="text-muted-foreground">Loading your favorite products...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-5 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-muted rounded animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                    <div className="h-10 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Favorite Products</h2>
          <p className="text-muted-foreground">
            {products.length > 0
              ? "Here's a list of your favorite products"
              : "You haven't added any products to your favorites yet"}
          </p>
        </div>
        {products.length > 0 && (
          <Button variant="outline" onClick={exportToExcel} className="gap-2">
            <Download className="h-4 w-4" />
            Extract
          </Button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorite products yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Browse products and click the heart icon to add them to your favorites for easy access later.
          </p>
          <Button asChild>
            <Link href="/scrap">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative">
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <FavoriteButton
                  productId={item.id}
                  isFavorited={favorites.includes(item.id)}
                  onClick={() => handleFavoriteToggle(item)}
                />
                {item.price && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white text-sm px-2 py-1 rounded">
                    {item.price}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium capitalize">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p>{item.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit</p>
                      <p>{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p>{item.availableQuantity}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="w-full bg-green-500" onClick={() => handleRequestInspection(item.id)}>
                      Request Inspection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

interface FavoriteButtonProps {
  productId: string
  isFavorited: boolean
  onClick: () => void
}

function FavoriteButton({ productId, isFavorited, onClick }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-2 right-2 rounded-full transition-all duration-300 transform",
        isFavorited
          ? "bg-red-100 hover:bg-red-200 text-red-500 hover:scale-110"
          : "bg-white/80 hover:bg-white/90 hover:text-red-500 hover:scale-110",
      )}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-4 w-4 transition-all duration-300", isFavorited && "fill-red-500 text-red-500")} />
      <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
    </Button>
  )
}

