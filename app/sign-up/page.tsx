"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import Image from "next/image"
import { Check, Eye, EyeOff, Search, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Define the form schema with validations
const formSchema = z
  .object({
    fullName: z.string().min(8, { message: "Name must be at least 8 characters" }),
    phoneNumber: z.string().regex(/^[5-7]\d{8}$/, {
      message: "Phone number must start with 5, 6, or 7 and have 8 additional digits",
    }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    willaya: z.string().min(1, { message: "Please select a willaya" }),
    dayra: z.string().min(1, { message: "Please select a dayra" }),
    baladia: z.string().min(1, { message: "Please select a baladia" }),
    addressDetails: z.string().optional(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string(),
    showPassword: z.boolean().default(false),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Define interests data
const interests = [
  { id: 1, name: "Emo stuff", image: "/images/1.jpeg" },
  { id: 2, name: "selicon", image: "/images/2.jpeg" },
  { id: 3, name: "Electronique", image: "/images/5.jpeg" },
  { id: 4, name: "Electronique", image: "/images/6.jpeg" },
  { id: 5, name: "Spooky Art", image: "/images/3.jpeg" },
  { id: 6, name: "Dark Art", image: "/images/4.jpeg" },
  { id: 7, name: "Gothic art", image: "/images/3.jpeg" },
  { id: 8, name: "Gothic art", image: "/images/1.jpeg" },
]

// Dummy data for address dropdowns
const willayaOptions = ["Tebessa","Skikda","Algier", "Oran", "Constantine", "Annaba", "Batna", "Tlemcen"]

const dayraOptions = ["Dayra 1", "Dayra 2", "Dayra 3", "Dayra 4", "Dayra 5", "Dayra 6"]

const baladiaOptions = ["Baladia 1", "Baladia 2", "Baladia 3", "Baladia 4", "Baladia 5", "Baladia 6"]

export default function CreateAccount() {
  const [step, setStep] = useState(1)
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const [openWillaya, setOpenWillaya] = useState(false)
  const [openDayra, setOpenDayra] = useState(false)
  const [openBaladia, setOpenBaladia] = useState(false)

  const [willayaSearchQuery, setWillayaSearchQuery] = useState("")
  const [dayraSearchQuery, setDayraSearchQuery] = useState("")
  const [baladiaSearchQuery, setBaladiaSearchQuery] = useState("")

  const filteredWillayaOptions = willayaOptions.filter((option) =>
    option.toLowerCase().includes(willayaSearchQuery.toLowerCase()),
  )

  const filteredDayraOptions = dayraOptions.filter((option) =>
    option.toLowerCase().includes(dayraSearchQuery.toLowerCase()),
  )

  const filteredBaladiaOptions = baladiaOptions.filter((option) =>
    option.toLowerCase().includes(baladiaSearchQuery.toLowerCase()),
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      willaya: "",
      dayra: "",
      baladia: "",
      addressDetails: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      agreeToTerms: false,
    },
  })

  // Update password visibility when showPassword checkbox changes
  const showPassword = form.watch("showPassword")
  useEffect(() => {
    setShowPasswordField(showPassword)
    setShowConfirmPasswordField(showPassword)
  }, [showPassword])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setStep(2)
    } else {
      console.log("Form submitted:", values, "Selected interests:", selectedInterests)
      // Here you would typically send the data to your backend
      alert("Account created successfully!")
    }
  }

  const toggleInterest = (id: number) => {
    setSelectedInterests((prev) => {
      // If already selected, remove it
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }

      // If not selected and we already have 3 interests, show a message
      if (prev.length >= 3) {
        toast({
          title: "Maximum interests reached",
          description: "You can only select up to 3 interests",
        })
        return prev
      }

      // Otherwise, add it
      return [...prev, id]
    })
  }

  const filteredInterests = interests.filter((interest) =>
    interest.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-medium text-center mb-1">Create an account</h1>
      <p className="text-center text-sm mb-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#4BB96A] font-medium">
          Log in
        </Link>
      </p>

      {/* Progress indicator with half-colored line in stage 1 */}
      <div className="flex items-center mb-8 relative">
        <div className="flex-1 flex items-center">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white bg-[#003731] z-10">
            1
          </div>
          <div className="flex-1 h-px bg-gray-200 mx-2 relative">
            {/* Colored overlay for the progress line */}
            <div
              className={`absolute top-0 left-0 h-full bg-[#4BB96A] transition-all duration-300 ease-in-out ${
                step === 1 ? "w-1/2" : "w-full"
              }`}
            ></div>
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
              step === 2 ? "bg-[#003731]" : "bg-gray-300"
            } z-10`}
          >
            2
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm mb-8">
        <span className={step === 1 ? "text-[#003731] font-medium" : "text-muted-foreground"}>
          Enter your email adress
        </span>
        <span className={step === 2 ? "text-[#003731] font-medium" : "text-muted-foreground"}>
          Provide your Interests info
        </span>
      </div>

      {step === 1 ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <div className="flex">
                    <div className="w-[72px] flex items-center justify-center border rounded-l-md bg-background mr-[-1px]">
                      <span className="text-xs">+213</span>
                    </div>
                    <FormControl>
                      <Input className="rounded-l-none" placeholder="XXX XXX XX XX" {...field} />
                    </FormControl>
                  </div>
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
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="mb-2 text-sm font-medium">Addressee</div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <FormField
                  control={form.control}
                  name="willaya"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover open={openWillaya} onOpenChange={setOpenWillaya}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openWillaya}
                              className="justify-between h-10 text-sm font-normal w-full"
                            >
                              {field.value ? field.value : "Select willaya..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search willaya..."
                              value={willayaSearchQuery}
                              onChange={(e) => setWillayaSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredWillayaOptions.length === 0 ? (
                              <div className="py-6 text-center text-sm">No willaya found.</div>
                            ) : (
                              filteredWillayaOptions.map((option) => (
                                <div
                                  key={option}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    option === field.value ? "bg-muted" : "",
                                  )}
                                  onClick={() => {
                                    form.setValue("willaya", option)
                                    form.clearErrors("willaya")
                                    setOpenWillaya(false)
                                  }}
                                >
                                  {option === field.value && <Check className="mr-2 h-4 w-4 flex-shrink-0" />}
                                  {option !== field.value && <div className="w-4 mr-2" />}
                                  {option}
                                </div>
                              ))
                            )}
                          </div>
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
                      <Popover open={openDayra} onOpenChange={setOpenDayra}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openDayra}
                              className="justify-between h-10 text-sm font-normal w-full"
                            >
                              {field.value ? field.value : "Select dayra..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search dayra..."
                              value={dayraSearchQuery}
                              onChange={(e) => setDayraSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredDayraOptions.length === 0 ? (
                              <div className="py-6 text-center text-sm">No dayra found.</div>
                            ) : (
                              filteredDayraOptions.map((option) => (
                                <div
                                  key={option}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    option === field.value ? "bg-muted" : "",
                                  )}
                                  onClick={() => {
                                    form.setValue("dayra", option)
                                    form.clearErrors("dayra")
                                    setOpenDayra(false)
                                  }}
                                >
                                  {option === field.value && <Check className="mr-2 h-4 w-4 flex-shrink-0" />}
                                  {option !== field.value && <div className="w-4 mr-2" />}
                                  {option}
                                </div>
                              ))
                            )}
                          </div>
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
                      <Popover open={openBaladia} onOpenChange={setOpenBaladia}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBaladia}
                              className="justify-between h-10 text-sm font-normal w-full"
                            >
                              {field.value ? field.value : "Select baladia..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[200px]">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search baladia..."
                              value={baladiaSearchQuery}
                              onChange={(e) => setBaladiaSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredBaladiaOptions.length === 0 ? (
                              <div className="py-6 text-center text-sm">No baladia found.</div>
                            ) : (
                              filteredBaladiaOptions.map((option) => (
                                <div
                                  key={option}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                    option === field.value ? "bg-muted" : "",
                                  )}
                                  onClick={() => {
                                    form.setValue("baladia", option)
                                    form.clearErrors("baladia")
                                    setOpenBaladia(false)
                                  }}
                                >
                                  {option === field.value && <Check className="mr-2 h-4 w-4 flex-shrink-0" />}
                                  {option !== field.value && <div className="w-4 mr-2" />}
                                  {option}
                                </div>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-xs text-muted-foreground mt-2 mb-1">Address complet</div>

              <FormField
                control={form.control}
                name="addressDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Additional address details (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPasswordField ? "text" : "password"} placeholder="Password" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPasswordField(!showPasswordField)}
                      >
                        {showPasswordField ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm your password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showConfirmPasswordField ? "text" : "password"}
                          placeholder="Confirm password"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                      >
                        {showConfirmPasswordField ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Use 8 or more characters with a mix of letters, numbers & symbols
            </p>

            <FormField
              control={form.control}
              name="showPassword"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#4BB96A] data-[state=checked]:border-[#4BB96A]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <div className="text-sm font-medium">Show password</div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-[#4BB96A] data-[state=checked]:border-[#4BB96A]"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <div className="text-sm font-medium">
                      Agree to{" "}
                      <Link href="/terms" className="text-[#4BB96A]">
                        Terms and conditions
                      </Link>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-[#4BB96A] hover:bg-[#3da05b]">
              Next
            </Button>
          </form>
        </Form>
      ) : (
        <div>
          <div className="bg-white rounded-lg border p-4 mb-4">
            <h2 className="font-medium mb-2">Interests</h2>
            <div className="relative mb-4">
              <Input
                placeholder="Interests"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {filteredInterests.map((interest) => (
                <div
                  key={interest.id}
                  className={`cursor-pointer rounded-md overflow-hidden flex flex-col items-center ${
                    selectedInterests.includes(interest.id) ? "ring-[#4BB96A] ring-2" : ""
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <div className="w-full h-16 bg-gray-100 relative">
                    <Image
                      src={interest.image || "/placeholder.svg?height=64&width=64"}
                      alt={interest.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-xs py-1 text-center w-full">{interest.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1 bg-[#4BB96A] hover:bg-[#3da05b]" onClick={() => form.handleSubmit(onSubmit)()}>
              Create account
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
