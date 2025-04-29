"use client"
import type React from "react"
import { useState } from "react"
import { Heart, Search, Filter, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  category: string
  name: string
  image: string
  status: string
  unit: string
  availableQuantity: string
  price?: string
  description?: string
}

const ScrapMarketplace: React.FC = () => {
  const { favorites, toggleFavorite, isFavorited } = useFavorites()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceValue, setPriceValue] = useState(50)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [priceType, setPriceType] = useState("all")
  const [recentlyFavorited, setRecentlyFavorited] = useState<string[]>([])
  const [showFavoritesPreview, setShowFavoritesPreview] = useState(false)

  // Sample data - in a real app, this would come from an API
  const products: Product[] = [
    {
      id: "1",
      category: "Mix scrap",
      name: "Scrap",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      price: "10,000 DA",
      description: "Mixed metal scrap materials for recycling",
    },
    {
      id: "2",
      category: "Mix scrap",
      name: "Scrap",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      price: "8,500 DA",
      description: "Assorted scrap materials from industrial sources",
    },
    {
      id: "3",
      category: "Steel",
      name: "Iron and sheet",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      price: "15,000 DA",
      description: "High-quality iron sheets for industrial use",
    },
    {
      id: "4",
      category: "Steel coils",
      name: "20 tons of silicone",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "ton",
      availableQuantity: "20",
      price: "300,000 DA",
      description: "Industrial grade silicone materials in bulk quantity",
    },
    {
      id: "5",
      category: "Rubber",
      name: "Jumbo rims",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "lot",
      availableQuantity: "1",
      price: "25,000 DA",
      description: "Large rubber rims for heavy machinery",
    },
    {
      id: "6",
      category: "Papers and Cartoon",
      name: "Filter",
      image: "/placeholder.svg?height=300&width=300",
      status: "Inspection",
      unit: "ton",
      availableQuantity: "500",
      price: "7,500 DA",
      description: "Industrial filters for recycling and repurposing",
    },
    {
      id: "7",
      category: "Metal",
      name: "Copper Wire",
      image: "/placeholder.svg?height=300&width=300",
      status: "Available",
      unit: "kg",
      availableQuantity: "250",
      price: "35,000 DA",
      description: "High-quality copper wire for electrical applications",
    },
    {
      id: "8",
      category: "Metal",
      name: "Aluminum Sheets",
      image: "/placeholder.svg?height=300&width=300",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      price: "22,000 DA",
      description: "Recycled aluminum sheets for manufacturing",
    },
    {
      id: "9",
      category: "Plastic",
      name: "PVC Pipes",
      image: "/placeholder.svg?height=300&width=300",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      price: "12,000 DA",
      description: "Used PVC pipes in good condition for recycling",
    },
  ]

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map((product) => product.category)))

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.category.toLowerCase())

    return matchesSearch && matchesCategory
  })

  // Get favorited products
  const favoritedProducts = products.filter((product) => favorites.includes(product.id))

  // Toggle category selection
  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories)
    if (selectedCategories.has(category.toLowerCase())) {
      newCategories.delete(category.toLowerCase())
    } else {
      newCategories.add(category.toLowerCase())
    }
    setSelectedCategories(newCategories)
  }

  // Handle favorite toggle with animation and toast notification
  const handleFavoriteToggle = (product: Product) => {
    toggleFavorite(product.id)

    // Add to recently favorited for animation
    if (!favorites.includes(product.id)) {
      setRecentlyFavorited((prev) => [...prev, product.id])
      setTimeout(() => {
        setRecentlyFavorited((prev) => prev.filter((id) => id !== product.id))
      }, 2000)
    }

    // Show toast notification
    toast({
      title: favorites.includes(product.id) ? "Removed from favorites" : "Added to favorites",
      description: favorites.includes(product.id)
        ? `${product.name} has been removed from your favorites.`
        : `${product.name} has been added to your favorites.`,
      duration: 3000,
    })

    // Show favorites preview when adding
    if (!favorites.includes(product.id)) {
      setShowFavoritesPreview(true)
      setTimeout(() => {
        setShowFavoritesPreview(false)
      }, 5000)
    }
  }

  // Handle request inspection
  const handleRequestInspection = (productId: string) => {
    toast({
      title: "Inspection Requested",
      description: "Your inspection request has been submitted successfully.",
      duration: 3000,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header with favorites count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scrap Marketplace</h1>
          <p className="text-muted-foreground">Browse and find scrap materials for your needs</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <Link href="/buyer/favorites">
            <Button variant="outline" className="flex items-center gap-2">
              <Heart className={cn("h-5 w-5", favorites.length > 0 && "fill-red-500 text-red-500")} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {favorites.length}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Favorites preview - shows when a product is favorited */}
      {showFavoritesPreview && favoritedProducts.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30 relative">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              Your Favorite Products
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setShowFavoritesPreview(false)}>
              Hide
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoritedProducts.slice(0, 4).map((product) => (
              <Card
                key={product.id}
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  recentlyFavorited.includes(product.id) && "ring-2 ring-red-500 scale-105",
                )}
              >
                <div className="relative aspect-square">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <h3 className="text-white font-medium truncate">{product.name}</h3>
                    <p className="text-white/80 text-sm">{product.price}</p>
                  </div>
                </div>
              </Card>
            ))}
            {favoritedProducts.length > 4 && (
              <div className="flex items-center justify-center">
                <Link href="/buyer/favorites">
                  <Button variant="outline">View all {favoritedProducts.length} favorites</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="md:hidden mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          {selectedCategories.size > 0 && <Badge variant="secondary">{selectedCategories.size} selected</Badge>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar */}
        <aside
          className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 bg-card p-5 rounded-lg border h-fit sticky top-4`}
        >
          <h2 className="text-xl font-bold mb-4 hidden md:block">Filters</h2>

          {/* Price Filter */}
          <div className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Price</h3>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  checked={priceType === "all"}
                  onChange={() => setPriceType("all")}
                  className="text-primary"
                />
                <span>All</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  checked={priceType === "fixed"}
                  onChange={() => setPriceType("fixed")}
                  className="text-primary"
                />
                <span>Fixed price</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  checked={priceType === "negotiable"}
                  onChange={() => setPriceType("negotiable")}
                  className="text-primary"
                />
                <span>Negotiable</span>
              </label>
            </div>
            <div className="mt-6 px-2 relative">
              <div className="w-full h-1 bg-muted rounded-full">
                <div className="h-1 bg-primary rounded-full bg-green-500" style={{ width: `${priceValue}%` }}></div>
              </div>
              <div
                className="absolute -top-4 w-8 h-8 rounded-full bg-primary border-2 border-background shadow-md flex items-center justify-center text-white bg-green-500"
                style={{ left: `calc(${priceValue}% - 16px)` }}
              >
                <span className="text-xs font-bold ">•</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priceValue}
                onChange={(e) => setPriceValue(Number(e.target.value))}
                className="absolute top-0 w-full h-1 opacity-0 cursor-pointer bg-green-500"
              />
              <div className="flex justify-between mt-2 text-sm ">
                <span>0 DA</span>
                <span>100,000 DA</span>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Category</h3>
              {selectedCategories.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategories(new Set())}
                  className="h-8 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category.toLowerCase())}
                    onChange={() => toggleCategory(category)}
                    className="text-primary rounded"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="pl-9 pr-4"
              placeholder="Search for products by name, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategories(new Set())
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorited={favorites.includes(product.id)}
                  isRecentlyFavorited={recentlyFavorited.includes(product.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(product)}
                  onRequestInspection={() => handleRequestInspection(product.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isFavorited: boolean
  isRecentlyFavorited: boolean
  onFavoriteToggle: () => void
  onRequestInspection: () => void
}

function ProductCard({
  product,
  isFavorited,
  isRecentlyFavorited,
  onFavoriteToggle,
  onRequestInspection,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden group transition-all duration-300",
        isRecentlyFavorited && "ring-2 ring-red-500 scale-105",
      )}
    >
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
            <h3 className="font-medium capitalize">{product.name}</h3>
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

          {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}

          <div className="flex gap-2 pt-2">
            <Button className="w-full bg-green-500" onClick={onRequestInspection}>
              Request Inspection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScrapMarketplace

