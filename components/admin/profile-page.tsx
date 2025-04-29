"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Camera, Check, ChevronsUpDown, MapPin, Phone, Mail, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// Add these imports at the top of the file
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

// Mock data for addresses
const wilayaOptions = [
  { label: "Tebessa", value: "tebessa" },
  { label: "Algiers", value: "algiers" },
  { label: "Oran", value: "oran" },
  { label: "Constantine", value: "constantine" },
  { label: "Annaba", value: "annaba" },
]

const dayraOptions = {
  tebessa: [
    { label: "Cheria", value: "cheria" },
    { label: "Bir el Ater", value: "bir-el-ater" },
    { label: "El Kouif", value: "el-kouif" },
  ],
  algiers: [
    { label: "Bab El Oued", value: "bab-el-oued" },
    { label: "Hussein Dey", value: "hussein-dey" },
    { label: "El Harrach", value: "el-harrach" },
  ],
  oran: [
    { label: "Ain Turk", value: "ain-turk" },
    { label: "Es Senia", value: "es-senia" },
    { label: "Bir El Djir", value: "bir-el-djir" },
  ],
  constantine: [
    { label: "El Khroub", value: "el-khroub" },
    { label: "Hamma Bouziane", value: "hamma-bouziane" },
  ],
  annaba: [
    { label: "El Bouni", value: "el-bouni" },
    { label: "Berrahal", value: "berrahal" },
  ],
}

const baladiaOptions = {
  cheria: [
    { label: "Cheria", value: "cheria" },
    { label: "Thlidjene", value: "thlidjene" },
  ],
  "bir-el-ater": [
    { label: "Bir el Ater", value: "bir-el-ater" },
    { label: "El Ogla", value: "el-ogla" },
  ],
  "bab-el-oued": [
    { label: "Bab El Oued", value: "bab-el-oued" },
    { label: "Casbah", value: "casbah" },
  ],
  "ain-turk": [
    { label: "Ain Turk", value: "ain-turk" },
    { label: "Bousfer", value: "bousfer" },
  ],
  "el-khroub": [
    { label: "El Khroub", value: "el-khroub" },
    { label: "Ain Smara", value: "ain-smara" },
  ],
  "el-bouni": [
    { label: "El Bouni", value: "el-bouni" },
    { label: "Sidi Amar", value: "sidi-amar" },
  ],
}

// Available interests
const availableInterests = [
  { label: "Battery", value: "battery", image: "/placeholder.svg?height=200&width=200" },
  { label: "Cars", value: "cars", image: "/placeholder.svg?height=200&width=200" },
  { label: "Foam", value: "foam", image: "/placeholder.svg?height=200&width=200" },
  { label: "Electronics", value: "electronics", image: "/placeholder.svg?height=200&width=200" },
  { label: "Furniture", value: "furniture", image: "/placeholder.svg?height=200&width=200" },
  { label: "Clothing", value: "clothing", image: "/placeholder.svg?height=200&width=200" },
  { label: "Sports", value: "sports", image: "/placeholder.svg?height=200&width=200" },
  { label: "Books", value: "books", image: "/placeholder.svg?height=200&width=200" },
  { label: "Music", value: "music", image: "/placeholder.svg?height=200&width=200" },
  { label: "Art", value: "art", image: "/placeholder.svg?height=200&width=200" },
  { label: "Food", value: "food", image: "/placeholder.svg?height=200&width=200" },
  { label: "Travel", value: "travel", image: "/placeholder.svg?height=200&width=200" },
  { label: "Health", value: "health", image: "/placeholder.svg?height=200&width=200" },
  { label: "Beauty", value: "beauty", image: "/placeholder.svg?height=200&width=200" },
  { label: "Home", value: "home", image: "/placeholder.svg?height=200&width=200" },
  { label: "Garden", value: "garden", image: "/placeholder.svg?height=200&width=200" },
  { label: "Pets", value: "pets", image: "/placeholder.svg?height=200&width=200" },
  { label: "Toys", value: "toys", image: "/placeholder.svg?height=200&width=200" },
  { label: "Tools", value: "tools", image: "/placeholder.svg?height=200&width=200" },
  { label: "Office", value: "office", image: "/placeholder.svg?height=200&width=200" },
]

// Form schema for contact settings
const contactFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().regex(/^\+213[5-7]\d{8}$/, {
    message: "Phone number must start with +213 followed by 5, 6, or 7 and then 8 more digits",
  }),
})

// Form schema for address settings
const addressFormSchema = z.object({
  wilaya: z.string().min(1, { message: "Please select a wilaya" }),
  dayra: z.string().min(1, { message: "Please select a dayra" }),
  baladia: z.string().min(1, { message: "Please select a baladia" }),
  addressee: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>
type AddressFormValues = z.infer<typeof addressFormSchema>

export function ProfilePage() {
  const { toast } = useToast()
  const [isPro, setIsPro] = useState(true)
  const [interests, setInterests] = useState<string[]>(["Battery", "Cars", "Foam"])
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const phoneInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState("User name")
  const [displayEmail, setDisplayEmail] = useState("usder@email.dz.com")
  const [displayPhone, setDisplayPhone] = useState("+213 966 696 123")
  const [displayAddress, setDisplayAddress] = useState("Wilaya,dayra,baladia")

  // Add this state for the interest dialog
  const [interestDialogOpen, setInterestDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Contact form
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "small houssame eddine",
      email: "usersettings2025@gmail.com",
      phone: "+2135XXXXXXXX",
    },
  })

  // Address form
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      wilaya: "tebessa",
      dayra: "cheria",
      baladia: "cheria",
      addressee: "",
    },
  })

  const watchWilaya = addressForm.watch("wilaya")
  const watchDayra = addressForm.watch("dayra")

  // Custom phone input handler
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Always ensure the value starts with +213
    if (!value.startsWith("+213")) {
      value = "+213" + value.replace(/^\+213/, "")
    }

    // Restrict the first digit after +213 to be 5, 6, or 7
    const match = value.match(/^\+213(\d?)(.*)$/)
    if (match) {
      const firstDigit = match[1]
      const rest = match[2]

      if (firstDigit && !["5", "6", "7"].includes(firstDigit)) {
        value = "+213" + rest
      }
    }

    // Limit to +213 + 9 digits
    if (value.length > 13) {
      value = value.slice(0, 13)
    }

    contactForm.setValue("phone", value, { shouldValidate: true })
  }

  // Position cursor after +213 when focusing empty input
  useEffect(() => {
    const handleFocus = () => {
      if (phoneInputRef.current) {
        const value = phoneInputRef.current.value
        if (value === "+213" || value === "") {
          phoneInputRef.current.value = "+213"
          setTimeout(() => {
            phoneInputRef.current?.setSelectionRange(4, 4)
          }, 0)
        }
      }
    }

    const input = phoneInputRef.current
    if (input) {
      input.addEventListener("focus", handleFocus)
      return () => {
        input.removeEventListener("focus", handleFocus)
      }
    }
  }, [])

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG or PNG image.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 2MB.",
        variant: "destructive",
      })
      return
    }

    // Create a URL for the image
    const imageUrl = URL.createObjectURL(file)
    setProfileImage(imageUrl)

    toast({
      title: "Image uploaded",
      description: "Your profile picture has been updated.",
    })
  }

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Toggle pro status
  const toggleProStatus = (checked: boolean) => {
    setIsPro(checked)
    toast({
      title: checked ? "Pro plan activated" : "Switched to basic plan",
      description: checked ? "You now have access to all pro features." : "Your plan has been changed to basic.",
    })
  }

  // Handle contact form submission
  function onContactSubmit(data: ContactFormValues) {
    setDisplayName(data.name)
    setDisplayEmail(data.email)
    setDisplayPhone(data.phone)

    toast({
      title: "Contact settings updated",
      description: "Your contact information has been successfully updated.",
    })
    console.log("Contact form data:", data)
  }

  // Handle address form submission
  function onAddressSubmit(data: AddressFormValues) {
    const wilayaLabel = wilayaOptions.find((option) => option.value === data.wilaya)?.label || ""
    const dayraLabel =
      dayraOptions[data.wilaya as keyof typeof dayraOptions]?.find((option) => option.value === data.dayra)?.label || ""
    const baladiaLabel =
      baladiaOptions[data.dayra as keyof typeof baladiaOptions]?.find((option) => option.value === data.baladia)
        ?.label || ""

    setDisplayAddress(`${wilayaLabel},${dayraLabel},${baladiaLabel}`)

    toast({
      title: "Address updated",
      description: "Your address has been successfully updated.",
    })
    console.log("Address form data:", data)
  }

  // Reset contact form
  function resetContactForm() {
    contactForm.reset({
      name: "smaai houssam eddine",
      email: "usersettings2025@gmail.com",
      phone: "+2135XXXXXXXX",
    })
    toast({
      title: "Contact settings reset",
      description: "Your contact settings have been reset to default values.",
    })
  }

  // Reset address form
  function resetAddressForm() {
    addressForm.reset({
      wilaya: "tebessa",
      dayra: "cheria",
      baladia: "cheria",
      addressee: "",
    })
    toast({
      title: "Address reset",
      description: "Your address has been reset to default values.",
    })
  }

  // Add interest
  function addInterest(interest: string) {
    if (!interests.includes(interest) && interests.length < 3) {
      setInterests([...interests, interest])
    } else if (interests.length >= 3) {
      toast({
        title: "Maximum interests reached",
        description: "You can select up to 3 interests.",
        variant: "destructive",
      })
    }
  }

  // Remove interest
  function removeInterest(interest: string) {
    setInterests(interests.filter((i) => i !== interest))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold tracking-tight">Profile</h2>
        <p className="text-sm text-muted-foreground">Profile settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Profile Card */}
        <div className="rounded-lg border bg-white p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {/* Profile Image Upload Area */}
              <div
                className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={triggerFileInput}
              >
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Pro Badge - Only shown when isPro is true */}
              {isPro && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  pro
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold text-indigo-900">{displayName}</h3>

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{displayAddress}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{displayPhone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{displayEmail}</span>
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm font-medium mb-2">Interest</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-gray-100">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className="text-sm font-medium mb-2">Plan:</p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Ind</span>
                <Switch checked={isPro} onCheckedChange={toggleProStatus} />
                <Badge variant="outline" className={isPro ? "bg-green-100 text-green-800 border-green-200" : ""}>
                  pro
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Settings */}
            <div className="rounded-lg border bg-white p-6">
              <h4 className="text-base font-medium mb-4">contact settings</h4>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="smaai houssam eddine" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contactForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="usersettings2025@gmail.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={contactForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              ref={phoneInputRef}
                              onChange={handlePhoneInput}
                              onFocus={(e) => {
                                if (!e.target.value) {
                                  e.target.value = "+213"
                                  field.onChange("+213")
                                }
                              }}
                              className="pl-12"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none bg-gray-100 border-r rounded-l-md">
                              <span className="text-sm font-medium text-gray-500">+213</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetContactForm}
                      className="text-xs px-3 py-1 h-8"
                    >
                      Reset settings
                    </Button>
                    <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-xs px-3 py-1 h-8">
                      update
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Address Settings */}
            <div className="rounded-lg border bg-white p-6">
              <h4 className="text-base font-medium mb-4">Address</h4>
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={addressForm.control}
                      name="wilaya"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Wilaya</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between h-9 px-3 py-1",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? wilayaOptions.find((option) => option.value === field.value)?.label
                                    : "Wilaya"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search wilaya..." />
                                <CommandList>
                                  <CommandEmpty>No wilaya found.</CommandEmpty>
                                  <CommandGroup>
                                    {wilayaOptions.map((option) => (
                                      <CommandItem
                                        value={option.label}
                                        key={option.value}
                                        onSelect={() => {
                                          addressForm.setValue("wilaya", option.value)
                                          addressForm.setValue("dayra", "")
                                          addressForm.setValue("baladia", "")
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            option.value === field.value ? "opacity-100" : "opacity-0",
                                          )}
                                        />
                                        {option.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addressForm.control}
                      name="dayra"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dayra</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between h-9 px-3 py-1",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  disabled={!watchWilaya}
                                >
                                  {field.value && watchWilaya
                                    ? dayraOptions[watchWilaya as keyof typeof dayraOptions]?.find(
                                        (option) => option.value === field.value,
                                      )?.label ?? "Dayra"
                                    : "Dayra"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search dayra..." />
                                <CommandList>
                                  <CommandEmpty>No dayra found.</CommandEmpty>
                                  <CommandGroup>
                                    {watchWilaya &&
                                      dayraOptions[watchWilaya as keyof typeof dayraOptions]?.map((option) => (
                                        <CommandItem
                                          value={option.label}
                                          key={option.value}
                                          onSelect={() => {
                                            addressForm.setValue("dayra", option.value)
                                            addressForm.setValue("baladia", "")
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              option.value === field.value ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          {option.label}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={addressForm.control}
                      name="baladia"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Baladia</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between h-9 px-3 py-1",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  disabled={!watchDayra}
                                >
                                  {field.value && watchDayra
                                    ? baladiaOptions[watchDayra as keyof typeof baladiaOptions]?.find(
                                        (option) => option.value === field.value,
                                      )?.label ?? "Baladia"
                                    : "Baladia"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search baladia..." />
                                <CommandList>
                                  <CommandEmpty>No baladia found.</CommandEmpty>
                                  <CommandGroup>
                                    {watchDayra &&
                                      baladiaOptions[watchDayra as keyof typeof baladiaOptions]?.map((option) => (
                                        <CommandItem
                                          value={option.label}
                                          key={option.value}
                                          onSelect={() => {
                                            addressForm.setValue("baladia", option.value)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              option.value === field.value ? "opacity-100" : "opacity-0",
                                            )}
                                          />
                                          {option.label}
                                        </CommandItem>
                                      ))}
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

                  <FormField
                    control={addressForm.control}
                    name="addressee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Addressee complete</FormLabel>
                        <FormControl>
                          <Input placeholder="(optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetAddressForm}
                      className="text-xs px-3 py-1 h-8"
                    >
                      Reset settings
                    </Button>
                    <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-xs px-3 py-1 h-8">
                      update
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-lg border bg-white p-6">
            <h4 className="text-base font-medium mb-4">Interests</h4>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-between" onClick={() => setInterestDialogOpen(true)}>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Add interests</span>
                </div>
              </Button>

              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} className="flex items-center gap-1 bg-gray-100 text-gray-800">
                    {interest}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeInterest(interest)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {interest}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pinterest-style Interest Selection Dialog */}
            <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Choose interests ({interests.length}/3)</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search interests..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availableInterests
                      .filter((interest) => interest.label.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((interest) => {
                        const isSelected = interests.includes(interest.label)
                        return (
                          <div
                            key={interest.value}
                            className={`
                            relative rounded-lg overflow-hidden cursor-pointer transition-all
                            ${interests.length >= 3 && !isSelected ? "opacity-50 pointer-events-none" : ""}
                            ${isSelected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/50"}
                          `}
                            onClick={() => {
                              if (isSelected) {
                                // If already selected, remove it
                                removeInterest(interest.label)
                              } else if (interests.length < 3) {
                                // If not selected and under limit, add it
                                addInterest(interest.label)
                              }
                            }}
                          >
                            <div className="relative h-48 w-full">
                              <Image
                                src={interest.image || "/placeholder.svg"}
                                alt={interest.label}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-medium">{interest.label}</p>
                              </div>

                              {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  {availableInterests.filter((interest) =>
                    interest.label.toLowerCase().includes(searchQuery.toLowerCase()),
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No matching interests found</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
