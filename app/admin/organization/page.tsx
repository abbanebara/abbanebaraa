"use client"

import { useState } from "react"
import { DataTableAdmin } from "@/components/admin/data-table-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrganizationPageAdmin() {
  const [activeTab, setActiveTab] = useState("all")

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Organization name" },
    { key: "specialties", title: "specialties" },
    { key: "owner", title: "Owner" },
  ]

  const organizationData = [
    {
      id: "31231231231231",
      name: "sdosdosdo",
      specialties: "smooi housaam",
      owner: "user name of",
    },
    {
      id: "31231231231231",
      name: "Arlene McCoy",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Cody Fisher",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Esther Howard",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Ronald Richards",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Albert Flores",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Marvin McKinney",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
    {
      id: "31231231231231",
      name: "Floyd Miles",
      specialties: "smooi housaam",
      owner: "smooihousaam2004@gmail.com",
    },
  ]

  const actions = [
    {
      label: "View details",
      onClick: (row: any) => console.log("View details", row),
    },
    {
      label: "Delete",
      onClick: (row: any) => console.log("Delete", row),
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
          <DataTableAdmin columns={columns} data={organizationData} actions={actions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

