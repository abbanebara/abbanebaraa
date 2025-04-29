import { DashboardShell } from "@/components/dashboard-shell"
import { RequestsList } from "@/components/requests-list"

export default function RequestsPage() {
  return (
    <DashboardShell>
      <RequestsList />
    </DashboardShell>
  )
}

