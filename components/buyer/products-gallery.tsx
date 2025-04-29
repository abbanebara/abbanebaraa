"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Filter, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product } from "./favorites-list"

export function ProductsGallery() {
  const { favorites, toggleFavorite } = useFavorites()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  // Sample data for available products
  const availableProducts: Product[] = [
    {
      id: "1",
      name: "Scrap Metal",
      category: "Mix scrap",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "10,000 DA",
      description:
        "Mixed metal scrap materials for recycling. This lot includes various types of metal scraps collected from industrial sources.",
    },
    {
      id: "2",
      name: "Iron Sheets",
      category: "Steel",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "15,000 DA",
      description:
        "High-quality iron sheets for industrial use. These sheets are in good condition and suitable for manufacturing and construction.",
    },
    {
      id: "3",
      name: "Copper Wire",
      category: "Metal",
      status: "Available",
      unit: "kg",
      availableQuantity: "250",
      image: "/placeholder.svg",
      price: "25,000 DA",
      description:
        "High-quality copper wire for electrical applications. This copper wire has been properly sorted and is ready for recycling or reuse.",
    },
    {
      id: "4",
      name: "Aluminum Profiles",
      category: "Metal",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "12,000 DA",
      description:
        "Recycled aluminum profiles for manufacturing. These profiles are in good condition and can be used for various industrial applications.",
    },
    {
      id: "5",
      name: "Steel Coils",
      category: "Steel",
      status: "Available",
      unit: "ton",
      availableQuantity: "5",
      image: "/placeholder.svg",
      price: "18,000 DA",
      description:
        "Industrial steel coils for construction. These coils are of high quality and suitable for various construction projects.",
    },
    {
      id: "6",
      name: "Plastic Scraps",
      category: "Plastic",
      status: "Available",
      unit: "kg",
      availableQuantity: "500",
      image: "/placeholder.svg",
      price: "8,000 DA",
      description:
        "Sorted plastic scraps for recycling. These plastic scraps have been properly sorted by type and are ready for recycling.",
    },
    {
      id: "7",
      name: "Rubber Tires",
      category: "Rubber",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "5,000 DA",
      description:
        "Used rubber tires for recycling. These tires are in various conditions but suitable for recycling into new rubber products.",
    },
    {
      id: "8",
      name: "Paper Waste",
      category: "Paper",
      status: "Available",
      unit: "ton",
      availableQuantity: "2",
      image: "/placeholder.svg",
      price: "3,000 DA",
      description:
        "Sorted paper waste for pulping. This paper waste has been sorted and is ready for recycling into new paper products.",
    },
    {
      id: "9",
      name: "Glass Bottles",
      category: "Glass",
      status: "Available",
      unit: "kg",
      availableQuantity: "300",
      image: "/placeholder.svg",
      price: "4,000 DA",
      description:
        "Clean glass bottles for recycling. These bottles have been cleaned and sorted by color, ready for recycling.",
    },
    {
      id: "10",
      name: "Brass Fittings",
      category: "Metal",
      status: "Available",
      unit: "kg",
      availableQuantity: "150",
      image: "/placeholder.svg",
      price: "22,000 DA",
      description:
        "Recycled brass fittings for plumbing. These fittings are in good condition and can be reused in plumbing applications.",
    },
    {
      id: "11",
      name: "Stainless Steel",
      category: "Steel",
      status: "Available",
      unit: "ton",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "30,000 DA",
      description:
        "High-grade stainless steel for manufacturing. This stainless steel is of high quality and suitable for various industrial applications.",
    },
    {
      id: "12",
      name: "Zinc Plates",
      category: "Metal",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "17,000 DA",
      description:
        "Industrial zinc plates for construction. These zinc plates are in good condition and suitable for various construction projects.",
    },
  ]

  // Get unique categories for filter
  const categories = ["all", ...new Set(availableProducts.map((product) => product.category))]

  // Filter products based on search query and category
  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Handle favorite toggle
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

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse Products</h2>
          <p className="text-muted-foreground">Explore available products for purchase</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-card">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("")
              setCategoryFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorited={favorites.includes(product.id)}
              onFavoriteToggle={() => handleFavoriteToggle(product)}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isFavorited: boolean
  onFavoriteToggle: () => void
  onAddToCart: () => void
}

function ProductCard({ product, isFavorited, onFavoriteToggle, onAddToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
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
            onFavoriteToggle()
          }}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-4 w-4 transition-all duration-300", isFavorited && "fill-red-500 text-red-500")} />
          <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
        </Button>
        {product.price && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
            {product.price}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Status</p>
              <p>{product.status}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Unit</p>
              <p>{product.unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Available</p>
              <p>{product.availableQuantity}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="w-full" onClick={onAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

