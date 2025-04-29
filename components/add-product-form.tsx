"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

// Form validation schema
const formSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  price: z.string().min(1, "Price is required"),
  negotiable: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export function AddProductForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [formModified, setFormModified] = useState(false)

  // Price state management
  const [priceValue, setPriceValue] = useState<string>("")
  const [formattedPrice, setFormattedPrice] = useState<string>("0.00 DA")
  const [isPriceValid, setIsPriceValid] = useState(true)
  const [priceError, setPriceError] = useState<string>("")

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      description: "",
      quantity: 1,
      unit: "",
      price: "",
      negotiable: false,
    },
  })

  // Track form modifications
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormModified(true)
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // Format number with thousand separators
  const formatNumber = (value: string): string => {
    // Remove any non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, "")

    // Split into integer and decimal parts
    const parts = cleanValue.split(".")
    const integerPart = parts[0]
    const decimalPart = parts.length > 1 ? parts[1].slice(0, 2) : "00"

    // Add thousand separators to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")

    // Combine with decimal part and currency symbol
    return `${formattedInteger}.${decimalPart.padEnd(2, "0")} DA`
  }

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setFormModified(true)

    // Allow only numbers and decimal point during input
    const sanitizedValue = inputValue.replace(/[^\d.]/g, "")

    // Validate input
    const isValid = /^\d*\.?\d{0,2}$/.test(sanitizedValue)

    if (isValid) {
      setPriceValue(sanitizedValue)
      form.setValue("price", sanitizedValue)
      setIsPriceValid(true)
      setPriceError("")
    } else {
      setIsPriceValid(false)
      setPriceError("Please enter a valid price")
    }
  }

  // Format price when input field loses focus
  const handlePriceBlur = () => {
    if (priceValue === "") {
      setFormattedPrice("0.00 DA")
      return
    }

    if (isPriceValid) {
      setFormattedPrice(formatNumber(priceValue))
    }
  }

  // Handle price input focus
  const handlePriceFocus = () => {
    // Show only the raw number when focused
    setPriceValue(priceValue || "0.00")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormModified(true)

      // Limit to 5 images total
      const remainingSlots = 5 - images.length
      if (remainingSlots <= 0) {
        toast({
          title: "Maximum images reached",
          description: "You can only upload up to 5 images.",
          variant: "destructive",
        })
        return
      }

      const filesToAdd = Array.from(e.target.files).slice(0, remainingSlots)
      const newImages = filesToAdd.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormModified(true)
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    // Validate price
    if (!isPriceValid) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log the form data (in a real app, you would send this to your API)
      console.log("Form submitted:", {
        ...data,
        price: priceValue,
        images,
      })

      // Show success message
      toast({
        title: "Product added successfully",
        description: "Your product has been added to the catalog.",
      })

      // Reset form state
      setFormModified(false)

      // Navigate back to products page
      router.push("/products")
    } catch (error) {
      // Show error message
      toast({
        title: "Submission failed",
        description: "There was an error adding your product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    if (formModified) {
      setShowCancelDialog(true)
    } else {
      router.back()
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold mb-4">Add products</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Form fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="productName" className="block text-sm font-medium">
                  Product name
                </label>
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="productName" className="w-full border-gray-200 rounded-md" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium">
                  discerption
                </label>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          id="description"
                          className="w-full min-h-[80px] border-gray-200 rounded-md"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="quantity" className="block text-sm font-medium">
                    Quantity
                  </label>
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id="quantity" type="number" className="w-full border-gray-200 rounded-md" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="unit" className="block text-sm font-medium">
                    Unit
                  </label>
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input id="unit" className="w-full border-gray-200 rounded-md" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="price" className="block text-sm font-medium">
                  Price
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="price"
                      value={
                        isPriceValid
                          ? document.activeElement?.id === "price"
                            ? priceValue
                            : formattedPrice
                          : priceValue
                      }
                      onChange={handlePriceChange}
                      onBlur={handlePriceBlur}
                      onFocus={handlePriceFocus}
                      className={cn(
                        "w-full border-gray-200 rounded-md",
                        !isPriceValid && "border-red-300 focus:border-red-500",
                      )}
                      aria-invalid={!isPriceValid}
                    />
                    {priceError && <p className="text-xs text-red-500 mt-1 absolute">{priceError}</p>}
                  </div>
                  <FormField
                    control={form.control}
                    name="negotiable"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            id="negotiable"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={cn(
                              field.value ? "bg-teal-700" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 items-center rounded-full",
                            )}
                          />
                        </FormControl>
                        <label htmlFor="negotiable" className="text-sm">
                          Negotiable
                        </label>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right column - Image upload */}
            <div className="border rounded-md p-4">
              <div className="space-y-1">
                <h3 className="text-sm text-gray-600">upload category pictures</h3>
                <p className="text-xs text-gray-500">add 1 to 5</p>

                <div className="flex justify-end">
                  <span className="text-xs text-gray-500">{images.length}/5</span>
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="image-upload"
                    className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 text-center">select your file or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">png, jpg, jpeg accepted</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg,image/jpg"
                      multiple
                      onChange={handleImageUpload}
                      id="image-upload"
                      disabled={images.length >= 5 || isSubmitting}
                    />
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{`20241109_110332_HDR.jpg`}</span>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-800 hover:bg-gray-700 text-white min-w-[80px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "send"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog for Cancel */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to cancel? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue editing</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.back()} className="bg-red-500 hover:bg-red-600 text-white">
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
