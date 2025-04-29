import { DashboardShell } from "@/components/dashboard-shell"
import { ProductsTable, ProductsProvider } from "@/components/products-table"

export default function ProductsPage() {
  return (
    <DashboardShell>
      <ProductsProvider>
        <ProductsTable />
      </ProductsProvider>
    </DashboardShell>
  )
}

