"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function SettingsForm() {
  const [interests, setInterests] = useState<string[]>(["Battery", "Cars", "Foam"])
  const [newInterest, setNewInterest] = useState("")
  const [isPro, setIsPro] = useState(true)

  const addInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
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
                  <div className="h-24 w-24 rounded-full bg-muted" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Information</h4>

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
                    <p className="text-sm">usder@email.com</p>
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h4 className="font-medium">Profile settings</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Full name" defaultValue="Smaai houssam eddine" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="usersettings2025@gmail.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="number">Number</Label>
                    <Input id="number" defaultValue="+213 540544785" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value="••••••••••••••••" />
                    <Button variant="outline" size="sm" className="mt-2">
                      Reset password
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Select defaultValue="tebessa">
                          <SelectTrigger>
                            <SelectValue placeholder="Wilaya" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tebessa">Tebessa</SelectItem>
                            <SelectItem value="algiers">Algiers</SelectItem>
                            <SelectItem value="oran">Oran</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select defaultValue="cheria">
                          <SelectTrigger>
                            <SelectValue placeholder="Dayra" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cheria">Cheria</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Select defaultValue="cheria">
                          <SelectTrigger>
                            <SelectValue placeholder="Baladia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cheria">Cheria</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressee">Addressee complete</Label>
                    <Input id="addressee" placeholder="Optional" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests</Label>
                    <div className="flex gap-2">
                      <Input
                        id="interests"
                        placeholder="Add interests"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addInterest()}
                      />
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
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline">Reset settings</Button>
                  <Button>Save changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

