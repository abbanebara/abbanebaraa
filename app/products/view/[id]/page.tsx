import { DashboardShell } from "@/components/dashboard-shell"
import { ProductView } from "@/components/product-view"

export default function ViewProductPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <ProductView id={params.id} />
    </DashboardShell>
  )
}

