"use client"

import type React from "react"

import { useState } from "react"
import { X, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

export function ProfileSettings() {
  const { toast } = useToast()
  const [isPro, setIsPro] = useState(true)
  const [interests, setInterests] = useState<string[]>(["Battery", "Cars", "Foam"])
  const [newInterest, setNewInterest] = useState("")
  const [formData, setFormData] = useState({
    name: "smaai houssam eddine",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const resetPassword = () => {
    toast({
      title: "Password reset link sent",
      description: "A password reset link has been sent to your email.",
    })
  }

  const resetSettings = () => {
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    })
  }

  const saveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest) && interests.length < 3) {
      setInterests([...interests, newInterest])
      setNewInterest("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and set your green informations</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-medium">Profile</h3>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Circle - Positioned outside the card */}
          <div className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-200 mb-4"></div>

            {/* Information Card - Smaller width */}
            <Card className="border shadow-sm w-full md:w-[300px]">
              <CardContent className="p-6">
                <h4 className="text-base font-medium mb-4">Information</h4>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Name:</p>
                    <p className="text-sm">Name, Last Name</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Tel:</p>
                    <p className="text-sm">+213 966 696 123</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email:</p>
                    <p className="text-sm">user@email.com</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        Battery
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        Cars
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 border-gray-200">
                        Foam
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Plan:</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">simple</span>
                      <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-slate-700">
                        <div className="absolute mx-0.5 h-3 w-3 rounded-full bg-white transition-transform translate-x-4"></div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        pro
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings Card - Larger width */}
          <Card className="border shadow-sm flex-1">
            <CardContent className="p-6">
              <h4 className="text-base font-medium mb-4">Profile settings</h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Number</Label>
                  <Input
                    id="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    className="border-gray-200"
                    disabled
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2 bg-slate-800 text-white hover:bg-slate-700"
                    type="button"
                    onClick={resetPassword}
                  >
                    Reset password
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                      <Button variant="outline" className="w-full justify-between">
                        <span>{formData.wilaya}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Button variant="outline" className="w-full justify-between">
                        <span>{formData.dayra}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                    <div className="relative">
                      <Button variant="outline" className="w-full justify-between">
                        <span>{formData.baladia}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressee">Addressee complete</Label>
                  <Input
                    id="addressee"
                    name="addressee"
                    placeholder="(optional)"
                    value={formData.addressee}
                    onChange={handleInputChange}
                    className="border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="relative">
                    <div className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm items-center">
                      <Search className="h-4 w-4 mr-2 text-gray-400" />
                      <input
                        className="flex-1 bg-transparent outline-none placeholder:text-gray-400"
                        placeholder="Add interests"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addInterest()
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                      >
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

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" className="border-gray-200" onClick={resetSettings}>
                    Reset settings
                  </Button>
                  <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
                    save changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

