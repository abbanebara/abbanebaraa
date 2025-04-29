"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import type { Product } from "./favorites-list"

export function Recommendations() {
  const { favorites, toggleFavorite } = useFavorites()
  const { toast } = useToast()

  // Sample data for different categories
  const recommendedItems: Product[] = [
    {
      id: "1",
      name: "Scrap Metal",
      category: "Mix scrap",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "10000.00 DA",
      description: "Mixed metal scrap materials for recycling",
    },
    {
      id: "2",
      name: "Iron Sheets",
      category: "Steel",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "15000.00 DA",
      description: "High-quality iron sheets for industrial use",
    },
    {
      id: "3",
      name: "Copper Wire",
      category: "Metal",
      status: "Available",
      unit: "kg",
      availableQuantity: "250",
      image: "/placeholder.svg",
      price: "25000.00 DA",
      description: "High-quality copper wire for electrical applications",
    },
    {
      id: "4",
      name: "Aluminum Profiles",
      category: "Metal",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "12000.00 DA",
      description: "Recycled aluminum profiles for manufacturing",
    },
    {
      id: "5",
      name: "Steel Coils",
      category: "Steel",
      status: "Available",
      unit: "ton",
      availableQuantity: "5",
      image: "/placeholder.svg",
      price: "18000.00 DA",
      description: "Industrial steel coils for construction",
    },
    {
      id: "6",
      name: "Plastic Scraps",
      category: "Plastic",
      status: "Available",
      unit: "kg",
      availableQuantity: "500",
      image: "/placeholder.svg",
      price: "8000.00 DA",
      description: "Sorted plastic scraps for recycling",
    },
  ]

  const recentlyViewedItems: Product[] = [
    {
      id: "7",
      name: "Rubber Tires",
      category: "Rubber",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "5000.00 DA",
      description: "Used rubber tires for recycling",
    },
    {
      id: "8",
      name: "Paper Waste",
      category: "Paper",
      status: "Available",
      unit: "ton",
      availableQuantity: "2",
      image: "/placeholder.svg",
      price: "3000.00 DA",
      description: "Sorted paper waste for pulping",
    },
    {
      id: "9",
      name: "Glass Bottles",
      category: "Glass",
      status: "Available",
      unit: "kg",
      availableQuantity: "300",
      image: "/placeholder.svg",
      price: "4000.00 DA",
      description: "Clean glass bottles for recycling",
    },
  ]

  const similarToCartItems: Product[] = [
    {
      id: "10",
      name: "Brass Fittings",
      category: "Metal",
      status: "Available",
      unit: "kg",
      availableQuantity: "150",
      image: "/placeholder.svg",
      price: "22000.00 DA",
      description: "Recycled brass fittings for plumbing",
    },
    {
      id: "11",
      name: "Stainless Steel",
      category: "Steel",
      status: "Available",
      unit: "ton",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "30000.00 DA",
      description: "High-grade stainless steel for manufacturing",
    },
    {
      id: "12",
      name: "Zinc Plates",
      category: "Metal",
      status: "Available",
      unit: "lot",
      availableQuantity: "1",
      image: "/placeholder.svg",
      price: "17000.00 DA",
      description: "Industrial zinc plates for construction",
    },
  ]

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
        <p className="text-muted-foreground">Products we think you'll love based on your activity</p>
      </div>

      <Tabs defaultValue="recommended" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="recently-viewed">Recently Viewed</TabsTrigger>
          <TabsTrigger value="similar">Similar to Cart Items</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorited={favorites.includes(item.id)}
                onFavoriteToggle={() => handleFavoriteToggle(item)}
                onAddToCart={() => handleAddToCart(item)}
                showMatch
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recently-viewed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentlyViewedItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorited={favorites.includes(item.id)}
                onFavoriteToggle={() => handleFavoriteToggle(item)}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="similar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {similarToCartItems.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorited={favorites.includes(item.id)}
                onFavoriteToggle={() => handleFavoriteToggle(item)}
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isFavorited: boolean
  onFavoriteToggle: () => void
  onAddToCart: () => void
  showMatch?: boolean
}

function ProductCard({ product, isFavorited, onFavoriteToggle, onAddToCart, showMatch = false }: ProductCardProps) {
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
        {showMatch && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            98% match
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">{product.price}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={onAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

