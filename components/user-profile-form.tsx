"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import * as z from "zod"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

// Define the form schema with zod
const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must not exceed 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters" }).optional(),
  dob: z.date({ required_error: "Please select a date of birth" }),
  occupation: z.string().min(1, { message: "Please select an occupation" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, { message: "Please enter a valid phone number" })
    .optional()
    .or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Sample occupations data
const occupations = [
  { label: "Software Developer", value: "software-developer" },
  { label: "Designer", value: "designer" },
  { label: "Product Manager", value: "product-manager" },
  { label: "Marketing Specialist", value: "marketing-specialist" },
  { label: "Data Scientist", value: "data-scientist" },
  { label: "Teacher", value: "teacher" },
  { label: "Doctor", value: "doctor" },
  { label: "Engineer", value: "engineer" },
  { label: "Student", value: "student" },
  { label: "Other", value: "other" },
]

export function UserProfileForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    bio: "I'm a software developer with a passion for building great user experiences.",
    dob: new Date("1990-01-01"),
    occupation: "software-developer",
    website: "https://example.com",
    phone: "+1234567890",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      console.log("Form data:", data)
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
        <h2 className="text-2xl font-bold tracking-tight">User Profile</h2>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and how others see you on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
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
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormDescription>We'll never share your email with anyone else.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Occupation</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value
                                ? occupations.find((occupation) => occupation.value === field.value)?.label
                                : "Select occupation"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search occupation..." />
                            <CommandList>
                              <CommandEmpty>No occupation found.</CommandEmpty>
                              <CommandGroup>
                                {occupations.map((occupation) => (
                                  <CommandItem
                                    value={occupation.label}
                                    key={occupation.value}
                                    onSelect={() => {
                                      form.setValue("occupation", occupation.value)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        occupation.value === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {occupation.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Select your current occupation or role.</FormDescription>
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
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormDescription>Your phone number will be used for account recovery.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>Your personal or professional website.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little about yourself" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Write a short bio about yourself. This will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>
                  Reset
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

