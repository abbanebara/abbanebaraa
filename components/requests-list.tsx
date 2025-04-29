"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Sample data with dates
const requestsData = [
  {
    id: "1",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description + REQUEST TYPE C OR P",
    date: new Date(2023, 2, 15), // March 15, 2023
    responded: false,
  },
  {
    id: "2",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description",
    date: new Date(2023, 2, 14), // March 14, 2023
    responded: false,
  },
  {
    id: "3",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description",
    date: new Date(2023, 2, 13), // March 13, 2023
    responded: false,
  },
  {
    id: "4",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description",
    date: new Date(2023, 2, 12), // March 12, 2023
    responded: true,
  },
  {
    id: "5",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description",
    date: new Date(2023, 2, 11), // March 11, 2023
    responded: true,
  },
  {
    id: "6",
    productName: "Request for product name",
    companyName: "from company name",
    description: "description",
    date: new Date(2023, 2, 10), // March 10, 2023
    responded: true,
  },
]

export function RequestsList() {
  const [requests, setRequests] = useState([...requestsData])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter requests based on search query and status filter
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "responded") return matchesSearch && request.responded
    if (statusFilter === "not-responded") return matchesSearch && !request.responded

    return matchesSearch
  })

  const handleRemoveRequest = (id: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== id))
  }

  const handleResponse = (id: string) => {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, responded: true } : request)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Requests</h2>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 gap-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="not-responded">Not Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onRemove={() => handleRemoveRequest(request.id)}
              onRespond={() => handleResponse(request.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No requests found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RequestCard({
  request,
  onRemove,
  onRespond,
}: {
  request: any
  onRemove: () => void
  onRespond: () => void
}) {
  const { toast } = useToast()
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [responseText, setResponseText] = useState("")

  const handleResponse = () => {
    if (!responseText.trim()) {
      toast({
        title: "Empty response",
        description: "Please enter a response message.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Response sent",
      description: `Your response to ${request.productName} has been sent.`,
    })
    setShowResponseDialog(false)
    onRespond()
  }

  return (
    <>
      <Card className={request.responded ? "border-green-200" : ""}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{request.productName}</h3>
              <p className="text-sm text-muted-foreground">{request.companyName}</p>
            </div>

            <p className="text-sm">{request.description}</p>

            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">{format(request.date, "MMM d, yyyy")}</p>
              {request.responded && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Responded</span>
              )}
            </div>

            <div className="h-32 bg-muted rounded-md" />

            <div className="flex justify-end gap-2">
              {!request.responded && (
                <Button size="sm" onClick={() => setShowResponseDialog(true)}>
                  Response
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Response for {request.productName}</DialogTitle>
          </DialogHeader>
          <div className="text-lg text-muted-foreground mb-4">to {request.companyName}</div>
          <Textarea
            placeholder="description"
            className="min-h-[100px] text-base"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <div className="border rounded-lg p-8 flex justify-center items-center my-4">
            <Button variant="secondary" className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowResponseDialog(false)} className="flex-1">
              cancel
            </Button>
            <Button onClick={handleResponse} className="flex-1 bg-slate-900 hover:bg-slate-800">
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

