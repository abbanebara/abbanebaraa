import { DashboardShell } from "@/components/dashboard-shell"
import { BuyerOverview } from "@/components/buyer/overview"

export default function BuyerDashboardPage() {
  return (
    <DashboardShell>
      <BuyerOverview />
    </DashboardShell>
  )
}
