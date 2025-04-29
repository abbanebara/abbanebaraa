"use client"

import { useState } from "react"
import { DataTableAdmin } from "@/components/admin/data-table-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UsersPageAdmin() {
  const [activeTab, setActiveTab] = useState("all")

  const columns = [
    { key: "id", title: "ID" },
    { key: "userName", title: "user name" },
    { key: "email", title: "Emails" },
    { key: "phone", title: "phone Number" },
  ]

  const userData = [
    {
      id: "31",
      userName: "sdosdosdo",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Arlene McCoy",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Cody Fisher",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Esther Howard",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Ronald Richards",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Albert Flores",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Marvin McKinney",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
    {
      id: "3123",
      userName: "Floyd Miles",
      email: "emailhousam2004@gmail.com",
      phone: "05394932343",
    },
  ]

  const actions = [
    {
      label: "Edit",
      onClick: (row: any) => console.log("Edit", row),
    },
    {
      label: "Delete",
      onClick: (row: any) => console.log("Delete", row),
    },
    {
      label: "Ban",
      onClick: (row: any) => console.log("Ban", row),
    },
  ]

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">All (56)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <DataTableAdmin columns={columns} data={userData} actions={actions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

