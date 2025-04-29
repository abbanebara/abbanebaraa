import { DashboardShell } from "@/components/dashboard-shell"
import { Overview } from "@/components/overview"

export default function Home() {
  return (
    <DashboardShell>
      <Overview />
    </DashboardShell>
  )
}
