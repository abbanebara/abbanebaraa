"use client"

import { useState } from "react"
import { ResponseCardAdmin } from "@/components/admin/response-card-admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RequestsPageAdmin() {
  const [activeTab, setActiveTab] = useState("pending")
  const [sortBy, setSortBy] = useState("newest")

  const requestData = [
    {
      id: "402235",
      title: "Requests for ( request name )",
      company: "company name",
      date: "25/3/2023",
      group: "today",
    },
    {
      id: "402235",
      title: "Requests for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "today",
    },
    {
      id: "402235",
      title: "Response for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "yesterday",
      status: "Completed" as const,
      statusLabel: "Discarded" as const,
    },
    {
      id: "402235",
      title: "Response for (product name)",
      company: "company name",
      date: "25/3/2023",
      group: "yesterday",
      status: "Completed" as const,
      statusLabel: "Validated" as const,
    },
  ]

  const groupedRequests = requestData.reduce(
    (acc, request) => {
      if (!acc[request.group]) {
        acc[request.group] = []
      }
      acc[request.group].push(request)
      return acc
    },
    {} as Record<string, typeof requestData>,
  )

  return (
    <div>
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
          {Object.entries(groupedRequests).map(([group, requests]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">{group}</h3>
              {requests
                .filter((r) => !r.status)
                .map((request, index) => (
                  <ResponseCardAdmin
                    key={index}
                    title={request.title}
                    id={request.id}
                    company={request.company}
                    date={request.date}
                    onDiscard={() => console.log("Discard", request)}
                    onApprove={() => console.log("Approve", request)}
                    onView={() => console.log("View", request)}
                  />
                ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="validate">
          {Object.entries(groupedRequests).map(([group, requests]) => (
            <div key={group} className="mb-6">
              <h3 className="text-sm text-muted-foreground mb-4">{group}</h3>
              {requests
                .filter((r) => r.status)
                .map((request, index) => (
                  <ResponseCardAdmin
                    key={index}
                    title={request.title}
                    id={request.id}
                    company={request.company}
                    date={request.date}
                    status={request.status}
                    statusLabel={request.statusLabel}
                  />
                ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

