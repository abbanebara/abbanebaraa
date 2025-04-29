import { DashboardShell } from "@/components/dashboard-shell"
import { AddProductForm } from "@/components/add-product-form"
import { ProductsProvider } from "@/components/products-table"

export default function AddProductPage() {
  return (
    <DashboardShell>
      <ProductsProvider>
        <AddProductForm />
      </ProductsProvider>
    </DashboardShell>
  )
}
