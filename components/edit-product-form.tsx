"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Upload, Plus, FileIcon, Trash2, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Import the useProducts hook at the top of the file
import { useProducts } from "./products-table"

// Mock data for categories
const categoryOptions = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Home & Garden", value: "home-garden" },
  { label: "Toys", value: "toys" },
  { label: "Sports", value: "sports" },
  { label: "Automotive", value: "automotive" },
]

// Mock data for subcategories
const subcategoryOptions = {
  electronics: [
    { label: "Smartphones", value: "smartphones" },
    { label: "Laptops", value: "laptops" },
    { label: "Tablets", value: "tablets" },
    { label: "Accessories", value: "accessories" },
  ],
  clothing: [
    { label: "Men's", value: "mens" },
    { label: "Women's", value: "womens" },
    { label: "Children's", value: "childrens" },
  ],
  "home-garden": [
    { label: "Furniture", value: "furniture" },
    { label: "Decor", value: "decor" },
    { label: "Kitchen", value: "kitchen" },
  ],
  toys: [
    { label: "Action Figures", value: "action-figures" },
    { label: "Board Games", value: "board-games" },
    { label: "Dolls", value: "dolls" },
  ],
  sports: [
    { label: "Fitness", value: "fitness" },
    { label: "Outdoor", value: "outdoor" },
    { label: "Team Sports", value: "team-sports" },
  ],
  automotive: [
    { label: "Parts", value: "parts" },
    { label: "Accessories", value: "auto-accessories" },
    { label: "Tools", value: "tools" },
  ],
}

// Mock data for units
const unitOptions = [
  { label: "Piece", value: "piece" },
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Liter", value: "l" },
  { label: "Milliliter", value: "ml" },
  { label: "Meter", value: "m" },
  { label: "Centimeter", value: "cm" },
  { label: "Box", value: "box" },
  { label: "Pair", value: "pair" },
  { label: "Set", value: "set" },
]

// Form schema
const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }),
  unit: z.string().min(1, { message: "Unit is required" }),
  price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
  negotiable: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

type ProductFormValues = z.infer<typeof productFormSchema>

// Mock product data
const mockProduct = {
  id: "1",
  name: "Premium Smartphone",
  description: "A high-end smartphone with the latest features",
  category: "electronics",
  subcategory: "smartphones",
  quantity: 10,
  unit: "piece",
  price: 999.99,
  minPrice: 899.99,
  negotiable: true,
  isActive: true,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
}

type ImageFile = {
  url: string
  file?: File
  name: string
}

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const { updateProduct } = useProducts()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")
  const [newUnit, setNewUnit] = useState("")
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false)
  const [showNewSubcategoryDialog, setShowNewSubcategoryDialog] = useState(false)
  const [showNewUnitDialog, setShowNewUnitDialog] = useState(false)
  const [categories, setCategories] = useState(categoryOptions)
  const [subcategories, setSubcategories] = useState<typeof subcategoryOptions>(subcategoryOptions)
  const [units, setUnits] = useState(unitOptions)

  // First, add state for category description and picture
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState<string | null>(null)

  // Add state for subcategory description
  const [newSubcategoryDescription, setNewSubcategoryDescription] = useState("")

  // Add state for unit description
  const [newUnitDescription, setNewUnitDescription] = useState("")

  const [formattedPrice, setFormattedPrice] = useState("")
  const [priceError, setPriceError] = useState<string | null>(null)

  // Initialize form with mock data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: mockProduct.name,
      description: mockProduct.description,
      category: mockProduct.category,
      subcategory: mockProduct.subcategory,
      quantity: mockProduct.quantity,
      unit: mockProduct.unit,
      price: mockProduct.price,
      negotiable: mockProduct.negotiable,
      isActive: mockProduct.isActive,
    },
  })

  const watchCategory = form.watch("category")
  const watchNegotiable = form.watch("negotiable")

  // Reset subcategory when category changes
  useEffect(() => {
    if (watchCategory) {
      form.setValue("subcategory", "")
      setSelectedSubcategory("")
    }
  }, [watchCategory, form])

  // Add this useEffect to initialize the formatted price when the component loads
  useEffect(() => {
    if (mockProduct.price) {
      setFormattedPrice(formatCurrency(mockProduct.price))
    }
  }, [])

  // Add these functions to handle price formatting and validation
  const formatCurrency = useCallback((value: number | string): string => {
    // Remove non-digit characters except decimal point
    const numericValue = String(value).replace(/[^\d.]/g, "")

    // Ensure only one decimal point
    const parts = numericValue.split(".")
    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "")

    // Format with thousand separators
    const withSeparators =
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "")

    return withSeparators
  }, [])

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      // Allow empty input
      if (!value) {
        setFormattedPrice("")
        setPriceError(null)
        return
      }

      // Remove currency symbol and separators for processing
      const numericValue = value.replace(/[^\d.]/g, "")

      // Validate input
      if (!/^\d*\.?\d{0,2}$/.test(numericValue)) {
        setPriceError("Please enter a valid amount")
        return
      }

      setPriceError(null)
      setFormattedPrice(formatCurrency(numericValue))
    },
    [formatCurrency],
  )

  const handlePriceBlur = useCallback(() => {
    // Convert to number for validation
    const numericValue = Number.parseFloat(formattedPrice.replace(/,/g, ""))

    if (isNaN(numericValue)) {
      setFormattedPrice("")
      return
    }

    // Ensure two decimal places on blur
    const formatted = numericValue.toFixed(2)
    setFormattedPrice(formatCurrency(formatted))

    // Update the form value
    form.setValue("price", numericValue)
  }, [formattedPrice, formatCurrency, form])

  const [negotiable, setNegotiable] = useState(true)
  const [images, setImages] = useState<ImageFile[]>([
    { url: "/placeholder.svg", name: "20241109_110332_HDR.jpg" },
    { url: "/placeholder.svg", name: "20241109_110332_HDR.jpg" },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Category combobox states
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [categorySearch, setCategorySearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("electronics") // Default to Electronics

  // Subcategory combobox states
  const [subcategoryOpen, setSubcategoryOpen] = useState(false)
  const [subcategorySearch, setSubcategorySearch] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")

  // Unit combobox states
  const [unitOpen, setUnitOpen] = useState(false)
  const [unitSearch, setUnitSearch] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("piece")

  // Filter categories based on search
  const filteredCategories = categoryOptions.filter((cat) =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase()),
  )

  // Get available subcategories based on selected category
  const availableSubcategories = selectedCategory
    ? subcategories[selectedCategory as keyof typeof subcategories] || []
    : []

  // Filter subcategories based on search
  const filteredSubcategories = availableSubcategories.filter((subcat) =>
    subcat.label.toLowerCase().includes(subcategorySearch.toLowerCase()),
  )

  // Filter units based on search
  const filteredUnits = unitOptions.filter((unit) => unit.label.toLowerCase().includes(unitSearch.toLowerCase()))

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      // If it's a real file with an object URL, revoke it to prevent memory leaks
      if (newImages[index].file && newImages[index].url.startsWith("blob:")) {
        URL.revokeObjectURL(newImages[index].url)
      }
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    // Check if adding these files would exceed the 5 image limit
    const remainingSlots = 5 - images.length
    if (remainingSlots <= 0) {
      toast({
        title: "Image limit reached",
        description: "You can only upload a maximum of 5 images.",
        variant: "destructive",
      })
      return
    }

    const newFiles = Array.from(e.target.files).slice(0, remainingSlots)

    // Validate files
    const validFiles = newFiles.filter((file) => {
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format. Only JPG, JPEG, and PNG are accepted.`,
          variant: "destructive",
        })
        return false
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 5MB size limit.`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    if (validFiles.length === 0) return

    // Create new image objects with object URLs for preview
    const newImageFiles: ImageFile[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      name: file.name,
    }))

    setImages((prev) => [...prev, ...newImageFiles])
    e.target.value = "" // Reset input
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event object that handleFileUpload can process
      const fileList = e.dataTransfer.files
      const event = {
        target: {
          files: fileList,
          value: "",
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      handleFileUpload(event)
    }
  }

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Add a function to handle category image upload
  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Only PNG, JPG, and JPEG formats are supported.`,
        variant: "destructive",
      })
      return
    }

    // Check file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Image exceeds the 2MB size limit.`,
        variant: "destructive",
      })
      return
    }

    setCategoryImage(file)
    setCategoryImagePreview(URL.createObjectURL(file))
  }

  // Update the handleAddCategory function
  const handleAddCategory = () => {
    if (!newCategory) {
      toast({
        title: "Missing information",
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    const value = newCategory.toLowerCase().replace(/\s+/g, "-")
    setCategories([
      ...categories,
      {
        label: newCategory,
        value,
        // You would normally save these to the backend
        description: newCategoryDescription,
        imageUrl: categoryImagePreview,
      },
    ])
    form.setValue("category", value)
    setSubcategories({
      ...subcategories,
      [value]: [],
    })
    setNewCategory("")
    setNewCategoryDescription("")
    setCategoryImage(null)
    setCategoryImagePreview(null)
    setShowNewCategoryDialog(false)
  }

  // Update the handleAddSubcategory function
  const handleAddSubcategory = () => {
    if (!newSubcategory || !watchCategory) {
      toast({
        title: "Missing information",
        description: "Subcategory name is required",
        variant: "destructive",
      })
      return
    }

    const value = newSubcategory.toLowerCase().replace(/\s+/g, "-")
    const currentSubcategories = subcategories[watchCategory as keyof typeof subcategories] || []

    setSubcategories({
      ...subcategories,
      [watchCategory]: [
        ...currentSubcategories,
        {
          label: newSubcategory,
          value,
          description: newSubcategoryDescription,
        },
      ],
    })

    form.setValue("subcategory", value)
    setNewSubcategory("")
    setNewSubcategoryDescription("")
    setShowNewSubcategoryDialog(false)
  }

  // Update the handleAddUnit function
  const handleAddUnit = () => {
    if (!newUnit) {
      toast({
        title: "Missing information",
        description: "Unit name is required",
        variant: "destructive",
      })
      return
    }

    const value = newUnit.toLowerCase().replace(/\s+/g, "-")
    setUnits([
      ...units,
      {
        label: newUnit,
        value,
        description: newUnitDescription,
      },
    ])
    form.setValue("unit", value)
    setSelectedUnit(value)
    setNewUnit("")
    setNewUnitDescription("")
    setShowNewUnitDialog(false)
  }

  // Update the onSubmit function to update the product in the store
  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)
    try {
      // Convert formatted price string to number for submission
      const priceValue = Number.parseFloat(formattedPrice.replace(/,/g, ""))

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the product in the store with properly formatted price
      updateProduct(id, {
        name: data.name,
        isActive: data.isActive,
        price: `${priceValue.toFixed(2)} DZD`,
        negotiable: data.negotiable ? "YES" : "NO",
      })

      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      })

      console.log("Submitted data:", {
        ...data,
        price: priceValue,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
    toast({
      title: "Edit cancelled",
      description: "Your changes have been discarded.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Edit product</h2>
        <Button onClick={() => router.push("/products/add")}>
         <Plus className="mr-2 h-4 w-4" /> Add
       </Button>
      </div>

      <Card className="border rounded-lg">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Product Name */}
            <div className="space-y-1">
              <h3 className="text-base font-medium">Product name</h3>
              <p className="text-sm text-muted-foreground">discerption</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-6 md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Category Combobox - Styled exactly like the screenshot */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-normal">
                      Category
                    </Label>
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className="w-full justify-between h-10 px-3 font-normal text-left"
                        >
                          {selectedCategory
                            ? categoryOptions.find((cat) => cat.value === selectedCategory)?.label
                            : "Select category"}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          >
                            <path
                              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 shadow-md rounded-md border" align="start">
                        <div className="flex items-center border-b px-3 py-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            placeholder="Search category..."
                            className="flex h-8 w-full border-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-auto">
                          {filteredCategories.map((cat) => (
                            <div
                              key={cat.value}
                              className={cn(
                                "flex items-center px-3 py-2 cursor-pointer",
                                selectedCategory === cat.value ? "bg-blue-50" : "hover:bg-gray-50",
                              )}
                              onClick={() => {
                                setSelectedCategory(cat.value)
                                form.setValue("category", cat.value)
                                setCategorySearch("")
                                setCategoryOpen(false)
                              }}
                            >
                              {selectedCategory === cat.value && <Check className="mr-2 h-4 w-4 text-blue-600" />}
                              <span className={cn("text-sm", selectedCategory === cat.value ? "ml-0" : "ml-6")}>
                                {cat.label}
                              </span>
                            </div>
                          ))}
                          <div
                            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-t"
                            onClick={() => {
                              setShowNewCategoryDialog(true)
                              setCategoryOpen(false)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="text-sm">Add new category</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Subcategory Combobox - Styled exactly like the screenshot */}
                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-sm font-normal">
                      Subcategory
                    </Label>
                    <Popover open={subcategoryOpen} onOpenChange={setSubcategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={subcategoryOpen}
                          className="w-full justify-between h-10 px-3 font-normal text-left"
                          disabled={!selectedCategory}
                        >
                          {selectedSubcategory
                            ? availableSubcategories.find((subcat) => subcat.value === selectedSubcategory)?.label
                            : "Select subcategory"}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          >
                            <path
                              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 shadow-md rounded-md border" align="start">
                        <div className="flex items-center border-b px-3 py-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            placeholder="Search subcategory..."
                            className="flex h-8 w-full border-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={subcategorySearch}
                            onChange={(e) => setSubcategorySearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-auto">
                          {filteredSubcategories.map((subcat) => (
                            <div
                              key={subcat.value}
                              className={cn(
                                "flex items-center px-3 py-2 cursor-pointer",
                                selectedSubcategory === subcat.value ? "bg-blue-50" : "hover:bg-gray-50",
                              )}
                              onClick={() => {
                                setSelectedSubcategory(subcat.value)
                                form.setValue("subcategory", subcat.value)
                                setSubcategorySearch("")
                                setSubcategoryOpen(false)
                              }}
                            >
                              {selectedSubcategory === subcat.value && <Check className="mr-2 h-4 w-4 text-blue-600" />}
                              <span className={cn("text-sm", selectedSubcategory === subcat.value ? "ml-0" : "ml-6")}>
                                {subcat.label}
                              </span>
                            </div>
                          ))}
                          {selectedCategory && (
                            <div
                              className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-t"
                              onClick={() => {
                                setShowNewSubcategoryDialog(true)
                                setSubcategoryOpen(false)
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <span className="text-sm">Add new subcategory</span>
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-normal">
                      Quantity
                    </Label>
                    <Input id="quantity" placeholder="Quantity" className="h-10" />
                  </div>

                  {/* Unit Combobox - Styled exactly like the screenshot */}
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-sm font-normal">
                      Unit
                    </Label>
                    <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={unitOpen}
                          className="w-full justify-between h-10 px-3 font-normal text-left"
                        >
                          {selectedUnit
                            ? unitOptions.find((unit) => unit.value === selectedUnit)?.label
                            : "Select unit"}
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-2 h-4 w-4 shrink-0 opacity-50"
                          >
                            <path
                              d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0 shadow-md rounded-md border" align="start">
                        <div className="flex items-center border-b px-3 py-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            placeholder="Search unit..."
                            className="flex h-8 w-full border-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            value={unitSearch}
                            onChange={(e) => setUnitSearch(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-auto">
                          {filteredUnits.map((unit) => (
                            <div
                              key={unit.value}
                              className={cn(
                                "flex items-center px-3 py-2 cursor-pointer",
                                selectedUnit === unit.value ? "bg-blue-50" : "hover:bg-gray-50",
                              )}
                              onClick={() => {
                                setSelectedUnit(unit.value)
                                form.setValue("unit", unit.value)
                                setUnitSearch("")
                                setUnitOpen(false)
                              }}
                            >
                              {selectedUnit === unit.value && <Check className="mr-2 h-4 w-4 text-blue-600" />}
                              <span className={cn("text-sm", selectedUnit === unit.value ? "ml-0" : "ml-6")}>
                                {unit.label}
                              </span>
                            </div>
                          ))}
                          <div
                            className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-t"
                            onClick={() => {
                              setShowNewUnitDialog(true)
                              setUnitOpen(false)
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            <span className="text-sm">Add new unit</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-normal">
                    Price
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">DZD</span>
                      </div>
                      <Input
                        id="price"
                        className="h-10 pl-12 pr-16"
                        value={formattedPrice}
                        onChange={handlePriceChange}
                        onBlur={handlePriceBlur}
                        aria-invalid={priceError ? "true" : "false"}
                      />
                      {priceError && <div className="text-xs text-red-500 mt-1">{priceError}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="negotiable"
                        checked={negotiable}
                        onCheckedChange={setNegotiable}
                        className="data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                      />
                      <Label htmlFor="negotiable" className="text-sm">
                        Negotiable
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="md:col-span-1">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">add 3 to 5</span>
                    <span className="text-sm text-gray-500">{images.length}/5</span>
                  </div>

                  {/* Drop Area */}
                  <div
                    className="
                      border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4
                      flex flex-col items-center justify-center gap-1
                      bg-gray-100 cursor-pointer
                    "
                    onClick={images.length >= 5 ? undefined : openFileDialog}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={images.length >= 5 ? undefined : handleDrop}
                  >
                    <Upload className="h-6 w-6 text-gray-500 mb-1" />
                    <p className="text-xs text-center text-gray-700">select your file or drag and drop</p>
                    <p className="text-xs text-gray-500">png, jpg, jpeg accepted</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      disabled={images.length >= 5}
                      onChange={handleFileUpload}
                    />
                  </div>

                  {/* File List */}
                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-blue-600" />
                          <span className="text-xs">{image.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-transparent"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel} className="text-sm px-4 py-2 h-9">
                cancel
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                className="bg-black hover:bg-gray-900 text-sm px-4 py-2 h-9"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Submit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add new category</DialogTitle>
            <DialogDescription>
              Enter details for the new category. Categories help organize your products at the highest level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <p className="text-xs text-muted-foreground">Required field</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="category-description"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter a detailed description of this category"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Category Image</Label>
              <div className="border rounded-md p-4">
                {categoryImagePreview ? (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="relative w-full max-w-[200px] h-[150px] mx-auto">
                      <img
                        src={categoryImagePreview || "/placeholder.svg"}
                        alt="Category preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategoryImage(null)
                        setCategoryImagePreview(null)
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="category-image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer h-[150px] border-2 border-dashed rounded-md hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">Click to upload an image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, JPEG accepted (max 2MB)</p>
                    <input
                      id="category-image-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={handleCategoryImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Subcategory Dialog */}
      <Dialog open={showNewSubcategoryDialog} onOpenChange={setShowNewSubcategoryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add new subcategory</DialogTitle>
            <DialogDescription>
              Enter details for the new subcategory. Subcategories help organize products within the{" "}
              {watchCategory ? categories.find((cat) => cat.value === watchCategory)?.label : ""} category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="subcategory-name" className="font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subcategory-name"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Subcategory name"
              />
              <p className="text-xs text-muted-foreground">Required field</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory-description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="subcategory-description"
                value={newSubcategoryDescription}
                onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                placeholder="Enter a detailed description of this subcategory"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSubcategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubcategory} disabled={!newSubcategory}>
              Add Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Unit Dialog */}
      <Dialog open={showNewUnitDialog} onOpenChange={setShowNewUnitDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add new unit</DialogTitle>
            <DialogDescription>
              Enter details for the new unit. Units define how your product is measured or sold (e.g., piece, kg,
              liter).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="unit-name" className="font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="unit-name"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="Unit name"
              />
              <p className="text-xs text-muted-foreground">Required field</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit-description" className="font-medium">
                Description
              </Label>
              <Textarea
                id="unit-description"
                value={newUnitDescription}
                onChange={(e) => setNewUnitDescription(e.target.value)}
                placeholder="Enter a detailed description of this unit (e.g., how it's used)"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewUnitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUnit} disabled={!newUnit}>
              Add Unit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
