"use client"

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResponseCardProps {
  title: string
  id: string
  company: string
  date: string
  status?: "Completed" | "Pending"
  statusLabel?: "Discarded" | "Validated"
  onDiscard?: () => void
  onApprove?: () => void
  onView?: () => void
}

export function ResponseCardAdmin({
  title,
  id,
  company,
  date,
  status,
  statusLabel,
  onDiscard,
  onApprove,
  onView,
}: ResponseCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{title}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              #{id} From ( {company} )
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
        </div>

        {status && (
          <div className="mt-4">
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
              {status}
            </Badge>

            {statusLabel && (
              <Badge
                variant="outline"
                className={`ml-2 ${
                  statusLabel === "Discarded"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : "bg-green-100 text-green-800 hover:bg-green-100"
                }`}
              >
                {statusLabel === "Discarded" ? "Discarded" : "Validated"}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {(onDiscard || onApprove || onView) && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          {onDiscard && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDiscard}
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
            >
              discard
            </Button>
          )}
          {onApprove && (
            <Button
              variant="outline"
              size="sm"
              onClick={onApprove}
              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
            >
              approve
            </Button>
          )}
          {onView && (
            <Button size="sm" onClick={onView} className="bg-gray-900 hover:bg-gray-800">
              View
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

