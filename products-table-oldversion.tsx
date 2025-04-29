"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Create a global store for products data
// This will be used to share data between components
export const useProductsStore = () => {
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: "TASK-8782",
      name: "TASK-8782",
      status: "approved",
      isActive: true,
      shipping: "In Progress",
      price: "1000.00",
      negotiable: "YES",
    },
    {
      id: "TASK-7878",
      name: "TASK-7878",
      status: "approved",
      isActive: false,
      shipping: "shipped",
      price: "750.00",
      negotiable: "NO",
    },
    {
      id: "TASK-7839",
      name: "TASK-7839",
      status: "rejected",
      isActive: false,
      shipping: "shipped",
      price: "500.00",
      negotiable: "YES",
    },
    {
      id: "TASK-5562",
      name: "TASK-5562",
      status: "rejected",
      isActive: false,
      shipping: "In Progress",
      price: "1200.00",
      negotiable: "NO",
    },
  ])

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product])
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updatedProduct } : product)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}

// Create a context to share the store
export const ProductsContext = React.createContext<ReturnType<typeof useProductsStore> | null>(null)

// Create a provider component
export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useProductsStore()
  return <ProductsContext.Provider value={store}>{children}</ProductsContext.Provider>
}

// Hook to use the store
export const useProducts = () => {
  const context = React.useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}

export type Product = {
  id: string
  name: string
  status: string
  isActive: boolean
  shipping: string
  price: string
  negotiable: string
}

export function ProductsTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  // Use the products store
  const { products, deleteProduct } = useProducts()

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue("name") as string
        return <div>{value}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant="outline"
            className={
              status === "approved"
                ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
            }
          >
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <div className={isActive ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {isActive ? "Active" : "Desactive"}
          </div>
        )
      },
    },
    {
      accessorKey: "shipping",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Shipping
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const shipping = row.getValue("shipping") as string
        return (
          <Badge
            variant="outline"
            className={
              shipping === "In Progress"
                ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                : shipping === "shipped"
                  ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                  : ""
            }
          >
            {shipping}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue("price") as string
        return <div>{value} DA</div>
      },
    },
    {
      accessorKey: "negotiable",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Negotiable
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = row.getValue("negotiable") as string
        return <div>{value}</div>
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const handleDelete = () => {
          if (confirm("Are you sure you want to delete this product?")) {
            deleteProduct(row.original.id)

            toast({
              title: "Product deleted",
              description: `${row.original.name} has been deleted.`,
            })
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              
              <DropdownMenuItem onClick={() => router.push(`/products/view/${row.original.id}`)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/products/edit/${row.original.id}`)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Here's a list of your products</p>
        </div>
        <Button onClick={() => router.push("/products/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes("approved")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("status")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("status")?.setFilterValue([...filterValues, "approved"])
                  } else {
                    table.getColumn("status")?.setFilterValue(filterValues.filter((val) => val !== "approved"))
                  }
                }}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("status")?.getFilterValue() as string[])?.includes("not approved")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("status")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("status")?.setFilterValue([...filterValues, "not approved"])
                  } else {
                    table.getColumn("status")?.setFilterValue(filterValues.filter((val) => val !== "not approved"))
                  }
                }}
              >
                Not Approved
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Shipping <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("shipping")?.getFilterValue() as string[])?.includes("In Progress")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("shipping")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("shipping")?.setFilterValue([...filterValues, "In Progress"])
                  } else {
                    table.getColumn("shipping")?.setFilterValue(filterValues.filter((val) => val !== "In Progress"))
                  }
                }}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("shipping")?.getFilterValue() as string[])?.includes("shipped")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("shipping")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("shipping")?.setFilterValue([...filterValues, "shipped"])
                  } else {
                    table.getColumn("shipping")?.setFilterValue(filterValues.filter((val) => val !== "shipped"))
                  }
                }}
              >
                Shipped
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Negotiable <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("negotiable")?.getFilterValue() as string[])?.includes("YES")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("negotiable")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("negotiable")?.setFilterValue([...filterValues, "YES"])
                  } else {
                    table.getColumn("negotiable")?.setFilterValue(filterValues.filter((val) => val !== "YES"))
                  }
                }}
              >
                Yes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={(table.getColumn("negotiable")?.getFilterValue() as string[])?.includes("NO")}
                onCheckedChange={(value) => {
                  const filterValues = (table.getColumn("negotiable")?.getFilterValue() as string[]) || []
                  if (value) {
                    table.getColumn("negotiable")?.setFilterValue([...filterValues, "NO"])
                  } else {
                    table.getColumn("negotiable")?.setFilterValue(filterValues.filter((val) => val !== "NO"))
                  }
                }}
              >
                No
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

