"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

// Mock product data
const mockProduct = {
  id: "TASK-8782",
  name: "Product name",
  description: "description",
  category: "Electronics",
  subcategory: "Smartphones",
  quantity: 10,
  unit: "piece",
  price: "50000.00",
  negotiable: true,
  status: "approved",
  isActive: true,
}

export function ProductView({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product] = useState(mockProduct)

  // ✅ Fix: Define category image preview map
  const categoryImagePreview =
    {
      Electronics: "/images/categories/electronics.jpg",
      Smartphones: "/images/categories/smartphones.jpg",
      Metal: "/images/categories/metal.jpg",
      Plastic: "/images/categories/plastic.jpg",
      Paper: "/images/categories/paper.jpg",
      // Add more categories as needed
    }[product.category] || "/placeholder.svg"

  const handleEdit = () => {
    router.push(`/products/edit/${id}`)
  }

  return (
    <div className="border rounded-lg p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side - Form fields */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <input
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={product.category}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="subcategory" className="text-sm font-medium">
                Subcategory
              </label>
              <input
                id="subcategory"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={product.subcategory}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <input
                id="quantity"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={product.quantity}
                disabled
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unit" className="text-sm font-medium">
                Unit
              </label>
              <input
                id="unit"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={product.unit}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Price
            </label>
            <div className="flex items-center gap-4">
              <input
                id="price"
                className="flex h-10 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={`${product.price} DA`}
                disabled
              />
              <div className="flex items-center space-x-2">
                <div
                  className={`relative inline-flex h-[24px] w-[44px] shrink-0 rounded-full transition-colors ${
                    product.negotiable ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform ${
                      product.negotiable ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">Negotiable</span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Right side - Product image */}
        <div className="flex items-center justify-center">
          <div className="bg-muted rounded-md aspect-video w-full h-full flex items-center justify-center">
          <img
                        src={categoryImagePreview || "/placeholder-user.jpg"}
                        alt="Category preview"
                        className="w-full h-full object-cover rounded-md"
                      />
          </div>
        </div>
      </div>

      {/* Buttons at the bottom */}
      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button onClick={handleEdit}>Edit</Button>
      </div>
    </div>
  )
}
