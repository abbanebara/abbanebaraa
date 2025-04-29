"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

// Mock data for interests
const availableInterests = [
  "Battery",
  "Cars",
  "Foam",
  "Electronics",
  "Furniture",
  "Clothing",
  "Sports",
  "Books",
  "Music",
  "Art",
  "Food",
  "Travel",
  "Health",
  "Beauty",
  "Home",
  "Garden",
  "Pets",
  "Toys",
  "Tools",
  "Office",
]

const profileFormSchema = z
  .object({
    name: z.string().min(8, { message: "Name must be at least 8 characters long" }).max(50),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().regex(/^\+213[5-7]\d{8}$/, {
      message: "Phone number must start with +213 followed by 5, 6, or 7 and then 8 more digits",
    }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).optional(),
    confirmPassword: z.string().optional(),
    wilaya: z.string().min(1, { message: "Please select a wilaya" }),
    dayra: z.string().min(1, { message: "Please select a dayra" }),
    baladia: z.string().min(1, { message: "Please select a baladia" }),
    addressee: z.string().optional(),
    interests: z.array(z.string()).max(3, { message: "You can select up to 3 interests" }),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  name: "Smaai houssam eddine",
  email: "usersettings2025@gmail.com",
  phone: "+2135XXXXXXXX",
  wilaya: "tebessa",
  dayra: "cheria",
  baladia: "cheria",
  addressee: "",
  interests: ["Battery", "Cars", "Foam"],
}

export function SettingsForm() {
  const { toast } = useToast()
  const [isPro, setIsPro] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [newInterest, setNewInterest] = useState("")
  const phoneInputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowConfirmPassword] = useState(false)
  const [showConfirmPassword, setShowPassword] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  const watchWilaya = form.watch("wilaya")
  const watchDayra = form.watch("dayra")
  const watchInterests = form.watch("interests") || []

  // Reset dependent fields when wilaya changes
  useEffect(() => {
    if (watchWilaya) {
      form.setValue("dayra", "")
      form.setValue("baladia", "")
    }
  }, [watchWilaya, form])

  // Reset baladia when dayra changes
  useEffect(() => {
    if (watchDayra) {
      form.setValue("baladia", "")
    }
  }, [watchDayra, form])

  const addInterest = () => {
    if (newInterest && !watchInterests.includes(newInterest) && watchInterests.length < 3) {
      form.setValue("interests", [...watchInterests, newInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    form.setValue(
      "interests",
      watchInterests.filter((i) => i !== interest),
    )
  }

  const selectInterest = (interest: string) => {
    if (!watchInterests.includes(interest) && watchInterests.length < 3) {
      form.setValue("interests", [...watchInterests, interest])
    }
  }

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

    form.setValue("phone", value, { shouldValidate: true })
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

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      // Clear password fields after successful update
      form.setValue("password", "")
      form.setValue("confirmPassword", "")
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set your green informations</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Profile</h3>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-muted" />
                    <Button size="sm" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                      <span className="sr-only">Change avatar</span>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Information</h4>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name:</p>
                    <p className="text-sm">{form.getValues("name")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tel:</p>
                    <p className="text-sm">{form.getValues("phone")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-sm">{form.getValues("email")}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {watchInterests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Plan:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">simple</span>
                      <Switch checked={isPro} onCheckedChange={setIsPro} />
                      <Badge variant="outline" className={isPro ? "bg-green-100 text-green-800 border-green-200" : ""}>
                        pro
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <h4 className="font-medium">Profile settings</h4>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
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
                              <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none bg-muted border-r rounded-l-md">
                                <span className="text-sm font-medium text-muted-foreground">+213</span>
                              </div>
                            </div>
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            Format: +213 followed by 5, 6, or 7 and then 8 more digits
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? "Hide" : "Show"}
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>Leave blank to keep your current password</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? "Hide" : "Show"}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <FormField
                          control={form.control}
                          name="wilaya"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn("justify-between", !field.value && "text-muted-foreground")}
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
                                              form.setValue("wilaya", option.value)
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
                          control={form.control}
                          name="dayra"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn("justify-between", !field.value && "text-muted-foreground")}
                                      disabled={!watchWilaya}
                                    >
                                      {field.value && watchWilaya
                                        ? dayraOptions[watchWilaya as keyof typeof dayraOptions]?.find(
                                            (option) => option.value === field.value,
                                          )?.label || "Dayra"
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
                                                form.setValue("dayra", option.value)
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
                          control={form.control}
                          name="baladia"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn("justify-between", !field.value && "text-muted-foreground")}
                                      disabled={!watchDayra}
                                    >
                                      {field.value && watchDayra
                                        ? baladiaOptions[watchDayra as keyof typeof baladiaOptions]?.find(
                                            (option) => option.value === field.value,
                                          )?.label || "Baladia"
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
                                                form.setValue("baladia", option.value)
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
                    </div>

                    <FormField
                      control={form.control}
                      name="addressee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Addressee complete</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <FormLabel>Interests (max 3)</FormLabel>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {watchInterests.map((interest) => (
                                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                                  {interest}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 ml-1"
                                    onClick={() => removeInterest(interest)}
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove {interest}</span>
                                  </Button>
                                </Badge>
                              ))}
                            </div>

                            {watchInterests.length < 3 && (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add new interest"
                                  value={newInterest}
                                  onChange={(e) => setNewInterest(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addInterest()
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={addInterest}
                                  disabled={!newInterest || watchInterests.includes(newInterest)}
                                >
                                  Add
                                </Button>
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-medium mb-2">Or select from available interests:</p>
                              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                                {availableInterests
                                  .filter((interest) => !watchInterests.includes(interest))
                                  .map((interest) => (
                                    <Badge
                                      key={interest}
                                      variant="outline"
                                      className="cursor-pointer hover:bg-accent"
                                      onClick={() => selectInterest(interest)}
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                          </div>
                          <FormDescription>You can select up to 3 interests</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Reset settings
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
      </div>
    </div>
  )
}

