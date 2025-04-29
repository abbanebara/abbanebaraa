import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
}

export function StatCardAdmin({ title, value, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`rounded-full p-2 ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}

