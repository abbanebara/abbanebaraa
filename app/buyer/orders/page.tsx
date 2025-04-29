import { DashboardShell } from "@/components/dashboard-shell"
import { OrdersList } from "@/components/buyer/orders-list"

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrdersList />
    </DashboardShell>
  )
}

