import { DashboardShell } from "@/components/dashboard-shell"
import { EditProductForm } from "@/components/edit-product-form"
import { ProductsProvider } from "@/components/products-table"

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <ProductsProvider>
        <EditProductForm id={params.id} />
      </ProductsProvider>
    </DashboardShell>
  )
}
