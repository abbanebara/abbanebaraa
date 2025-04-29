"use client"

import type React from "react"

import { useState } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
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

export function ProfileForm() {
  const { toast } = useToast()
  const [isPro, setIsPro] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [interests, setInterests] = useState<string[]>(["Battery", "Cars", "Foam"])
  const [newInterest, setNewInterest] = useState("")
  const [formData, setFormData] = useState({
    name: "Smaai houssam eddine",
    email: "usersettings2025@gmail.com",
    phone: "+213 540544785",
    wilaya: "tebessa",
    dayra: "cheria",
    baladia: "cheria",
    addressee: "",
    password: "••••••••••••••••",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest) && interests.length < 3) {
      setInterests([...interests, newInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const resetPassword = () => {
    toast({
      title: "Password reset",
      description: "A password reset link has been sent to your email.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg border p-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Information</h4>

              <div className="space-y-1">
                <p className="text-sm font-medium">Name:</p>
                <p className="text-sm">{formData.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Tel:</p>
                <p className="text-sm">{formData.phone}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm">{formData.email}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
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
        </div>

        <div className="bg-white rounded-lg border p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Profile settings</h4>
              {!isEditing && (
                <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={true}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-slate-900 text-white hover:bg-slate-800"
                  type="button"
                  onClick={resetPassword}
                >
                  Reset password
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!isEditing}
                        className={cn("justify-between", !formData.wilaya && "text-muted-foreground")}
                      >
                        {formData.wilaya
                          ? wilayaOptions.find((option) => option.value === formData.wilaya)?.label
                          : "Wilaya"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]">
                      <Command>
                        <CommandInput placeholder="Search wilaya..." />
                        <CommandList>
                          <CommandEmpty>No wilaya found.</CommandEmpty>
                          <CommandGroup>
                            {wilayaOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  handleSelectChange("wilaya", option.value)
                                  handleSelectChange("dayra", "")
                                  handleSelectChange("baladia", "")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.wilaya === option.value ? "opacity-100" : "opacity-0",
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!isEditing || !formData.wilaya}
                        className={cn("justify-between", !formData.dayra && "text-muted-foreground")}
                      >
                        {formData.dayra && formData.wilaya
                          ? dayraOptions[formData.wilaya as keyof typeof dayraOptions]?.find(
                              (option) => option.value === formData.dayra,
                            )?.label
                          : "Dayra"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]">
                      <Command>
                        <CommandInput placeholder="Search dayra..." />
                        <CommandList>
                          <CommandEmpty>No dayra found.</CommandEmpty>
                          <CommandGroup>
                            {formData.wilaya &&
                              dayraOptions[formData.wilaya as keyof typeof dayraOptions]?.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={() => {
                                    handleSelectChange("dayra", option.value)
                                    handleSelectChange("baladia", "")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.dayra === option.value ? "opacity-100" : "opacity-0",
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

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={!isEditing || !formData.dayra}
                        className={cn("justify-between", !formData.baladia && "text-muted-foreground")}
                      >
                        {formData.baladia && formData.dayra
                          ? baladiaOptions[formData.dayra as keyof typeof baladiaOptions]?.find(
                              (option) => option.value === formData.baladia,
                            )?.label
                          : "Baladia"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]">
                      <Command>
                        <CommandInput placeholder="Search baladia..." />
                        <CommandList>
                          <CommandEmpty>No baladia found.</CommandEmpty>
                          <CommandGroup>
                            {formData.dayra &&
                              baladiaOptions[formData.dayra as keyof typeof baladiaOptions]?.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={() => handleSelectChange("baladia", option.value)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.baladia === option.value ? "opacity-100" : "opacity-0",
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressee">Addressee complete</Label>
                <Input
                  id="addressee"
                  name="addressee"
                  placeholder="Optional"
                  value={formData.addressee}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                {isEditing ? (
                  <>
                    <div className="relative">
                      <Input
                        id="interests"
                        placeholder="Add interests"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                        disabled={interests.length >= 3}
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {interests.map((interest) => (
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
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {availableInterests
                          .filter((interest) => !interests.includes(interest))
                          .slice(0, 6)
                          .map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="cursor-pointer hover:bg-accent"
                              onClick={() => {
                                if (interests.length < 3) {
                                  setInterests([...interests, interest])
                                }
                              }}
                            >
                              {interest}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Reset settings
                  </Button>
                  <Button type="submit" className="bg-slate-900 hover:bg-slate-800">
                    save changes
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

