"use client"

import { useState } from "react"
import { ResponseCardAdmin } from "@/components/admin/response-card-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ResponsesPageAdmin() {
  const [activeTab, setActiveTab] = useState("pending")
  const [sortBy, setSortBy] = useState("newest")

  const responseData = [
    {
      id: "402235",
      title: "Respons for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "today",
    },
    {
      id: "402235",
      title: "Respons for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "today",
    },
    {
      id: "402235",
      title: "Respons for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "yesterday",
      status: "Completed" as const,
      statusLabel: "Discarded" as const,
    },
    {
      id: "402235",
      title: "Respons for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "yesterday",
      status: "Completed" as const,
      statusLabel: "Validated" as const,
    },
  ]

  const groupedResponses = responseData.reduce(
    (acc, response) => {
      if (!acc[response.group]) {
        acc[response.group] = []
      }
      acc[response.group].push(response)
      return acc
    },
    {} as Record<string, typeof responseData>,
  )

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Here's a list of your responses</h2>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="pending" className="flex gap-2">
              Pending{" "}
              <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </TabsTrigger>
            <TabsTrigger value="validate" className="flex gap-2">
              Validate{" "}
              <span className="bg-gray-200 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                2
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Date</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">newest</SelectItem>
                <SelectItem value="oldest">oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="pending">
          {Object.entries(groupedResponses).map(([group, responses]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">{group}</h3>
              {responses
                .filter((r) => !r.status)
                .map((response, index) => (
                  <ResponseCardAdmin
                    key={index}
                    title={response.title}
                    id={response.id}
                    company={response.company}
                    date={response.date}
                    onDiscard={() => console.log("Discard", response)}
                    onApprove={() => console.log("Approve", response)}
                    onView={() => console.log("View", response)}
                  />
                ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="validate">
          {Object.entries(groupedResponses).map(([group, responses]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">{group}</h3>
              {responses
                .filter((r) => r.status)
                .map((response, index) => (
                  <ResponseCardAdmin
                    key={index}
                    title={response.title}
                    id={response.id}
                    company={response.company}
                    date={response.date}
                    status={response.status}
                    statusLabel={response.statusLabel}
                  />
                ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

