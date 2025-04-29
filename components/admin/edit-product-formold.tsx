"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

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

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  // Inside the EditProductForm function, add this line after the router and toast declarations
  const { updateProduct } = useProducts()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [images, setImages] = useState<(string | File)[]>(mockProduct.images)
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
    }
  }, [watchCategory, form])

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
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
    setNewUnit("")
    setNewUnitDescription("")
    setShowNewUnitDialog(false)
  }

  // Update the onSubmit function to update the product in the store
  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the product in the store
      updateProduct(id, {
        name: data.name,
        isActive: data.isActive,
        price: data.price.toString(),
        negotiable: data.negotiable ? "YES" : "NO",
      })

      toast({
        title: "Product updated",
        description: "Your product has been successfully updated.",
      })

      console.log("Submitted data:", data)
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = Array.from(e.target.files)
    const validFiles = newFiles.filter((file) => {
      // Check file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format.`,
          variant: "destructive",
        })
        return false
      }

      // Check file size (5MB max)
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

    // Limit to 5 images total
    const totalImages = images.length + validFiles.length
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: `You can upload a maximum of 5 images. Only the first ${5 - images.length} will be added.`,
        variant: "warning",
      })
      validFiles.splice(5 - images.length)
    }

    // Simulate upload with progress
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setImages((prevImages) => [...prevImages, ...validFiles])
          e.target.value = "" // Reset input
          return 0
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Edit product</h2>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter product description" className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Category</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("justify-between", !field.value && "text-muted-foreground")}
                                >
                                  {field.value
                                    ? categories.find((category) => category.value === field.value)?.label
                                    : "Select category"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandList>
                                  <CommandEmpty>
                                    <div className="py-6 text-center text-sm">
                                      <p>No category found.</p>
                                      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() => setShowNewCategoryDialog(true)}
                                          >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add new category
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Add new category</DialogTitle>
                                            <DialogDescription>
                                              Enter a name for the new category. Categories help organize your products
                                              at the highest level.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <Input
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="Category name"
                                            className="mt-4"
                                          />
                                          <DialogFooter className="mt-4">
                                            <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                                              Cancel
                                            </Button>
                                            <Button onClick={handleAddCategory}>Add</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categories.map((category) => (
                                      <CommandItem
                                        value={category.label}
                                        key={category.value}
                                        onSelect={() => {
                                          form.setValue("category", category.value)
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            category.value === field.value ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        {category.label}
                                      </CommandItem>
                                    ))}
                                    <CommandItem
                                      onSelect={() => {
                                        setShowNewCategoryDialog(true)
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add new category
                                    </CommandItem>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
                      <DialogContent className="sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Add new category</DialogTitle>
                          <DialogDescription>
                            Enter details for the new category. Categories help organize your products at the highest
                            level.
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

                    <FormField
                      control={form.control}
                      name="subcategory"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Subcategory</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("justify-between", !field.value && "text-muted-foreground")}
                                  disabled={!watchCategory}
                                >
                                  {field.value && watchCategory
                                    ? subcategories[watchCategory as keyof typeof subcategories]?.find(
                                        (subcategory) => subcategory.value === field.value,
                                      )?.label || "Select subcategory"
                                    : "Select subcategory"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search subcategory..." />
                                <CommandList>
                                  <CommandEmpty>
                                    <div className="py-6 text-center text-sm">
                                      <p>No subcategory found.</p>
                                      <Dialog
                                        open={showNewSubcategoryDialog}
                                        onOpenChange={setShowNewSubcategoryDialog}
                                      >
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="mt-2"
                                            onClick={() => setShowNewSubcategoryDialog(true)}
                                          >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add new subcategory
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Add new subcategory</DialogTitle>
                                            <DialogDescription>
                                              Enter a name for the new subcategory. Subcategories help organize products
                                              within a category.
                                            </DialogDescription>
                                          </DialogHeader>
                                          <Input
                                            value={newSubcategory}
                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                            placeholder="Subcategory name"
                                            className="mt-4"
                                          />
                                          <DialogFooter className="mt-4">
                                            <Button
                                              variant="outline"
                                              onClick={() => setShowNewSubcategoryDialog(false)}
                                            >
                                              Cancel
                                            </Button>
                                            <Button onClick={handleAddSubcategory}>Add</Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {watchCategory &&
                                      subcategories[watchCategory as keyof typeof subcategories]?.map((subcategory) => (
                                        <CommandItem
                                          value={subcategory.label}
                                          key={subcategory.value}
                                          onSelect={() => {
                                            form.setValue("subcategory", subcategory.value)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              subcategory.value === field.value ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          {subcategory.label}
                                        </CommandItem>
                                      ))}
                                    <CommandItem
                                      onSelect={() => {
                                        setShowNewSubcategoryDialog(true)
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add new subcategory
                                    </CommandItem>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Dialog open={showNewSubcategoryDialog} onOpenChange={setShowNewSubcategoryDialog}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add new subcategory</DialogTitle>
                          <DialogDescription>
                            Enter details for the new subcategory. Subcategories help organize products within the{" "}
                            {watchCategory ? categories.find((cat) => cat.value === watchCategory)?.label : ""}{" "}
                            category.
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("justify-between w-full", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? units.find((unit) => unit.value === field.value)?.label
                                      : "Select unit"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Search unit..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="py-6 text-center text-sm">
                                        <p>No unit found.</p>
                                        <Dialog open={showNewUnitDialog} onOpenChange={setShowNewUnitDialog}>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="mt-2"
                                              onClick={() => setShowNewUnitDialog(true)}
                                            >
                                              <Plus className="mr-2 h-4 w-4" />
                                              Add new unit
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Add new unit</DialogTitle>
                                              <DialogDescription>
                                                Enter a name for the new unit. Units define how your product is measured
                                                or sold (e.g., piece, kg, liter).
                                              </DialogDescription>
                                            </DialogHeader>
                                            <Input
                                              value={newUnit}
                                              onChange={(e) => setNewUnit(e.target.value)}
                                              placeholder="Unit name"
                                              className="mt-4"
                                            />
                                            <DialogFooter className="mt-4">
                                              <Button variant="outline" onClick={() => setShowNewUnitDialog(false)}>
                                                Cancel
                                              </Button>
                                              <Button onClick={handleAddUnit}>Add</Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {units.map((unit) => (
                                        <CommandItem
                                          value={unit.label}
                                          key={unit.value}
                                          onSelect={() => {
                                            form.setValue("unit", unit.value)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              unit.value === field.value ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          {unit.label}
                                        </CommandItem>
                                      ))}
                                      <CommandItem
                                        onSelect={() => {
                                          setShowNewUnitDialog(true)
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add new unit
                                      </CommandItem>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Dialog open={showNewUnitDialog} onOpenChange={setShowNewUnitDialog}>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Add new unit</DialogTitle>
                          <DialogDescription>
                            Enter details for the new unit. Units define how your product is measured or sold (e.g.,
                            piece, kg, liter).
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

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (DA)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="negotiable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Negotiable</FormLabel>
                            <FormDescription>Allow buyers to negotiate the price</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>Set whether this product is active or inactive</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Upload</Label>
                      <span className="text-sm text-muted-foreground">{images.length}/5</span>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <label
                          htmlFor="image-upload"
                          className="h-32 w-full border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                        >
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Select your file or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG accepted (max 5MB)</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/png,image/jpeg,image/jpg"
                            multiple
                            id="image-upload"
                            onChange={handleFileUpload}
                            disabled={images.length >= 5 || isUploading}
                          />
                        </label>
                        {isUploading && (
                          <div className="w-full mt-2">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-center mt-1">Uploading... {uploadProgress}%</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        {images.map((image, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                                <img
                                  src={typeof image === "string" ? image : URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <span className="ml-2 text-sm">
                                {typeof image === "string"
                                  ? `Image ${index + 1}`
                                  : image.name.length > 20
                                    ? image.name.substring(0, 20) + "..."
                                    : image.name}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveImage(index)}>
                              <span className="sr-only">Remove</span>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
