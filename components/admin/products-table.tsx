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
import { ArrowUpDown, MoreHorizontal, Plus, Search, X } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

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
     priceValue: 1000,
     negotiable: "YES",
     date: "2025-03-15",
     category: "Metal",
   },
   {
     id: "TASK-7878",
     name: "TASK-7878",
     status: "approved",
     isActive: false,
     shipping: "shipped",
     price: "750.00",
     priceValue: 750,
     negotiable: "NO",
     date: "2025-03-10",
     category: "Plastic",
   },
   {
     id: "TASK-7839",
     name: "TASK-7839",
     status: "not approved",
     isActive: false,
     shipping: "shipped",
     price: "500.00",
     priceValue: 500,
     negotiable: "YES",
     date: "2025-02-28",
     category: "Paper",
   },
   {
     id: "TASK-5562",
     name: "TASK-5562",
     status: "not approved",
     isActive: false,
     shipping: "In Progress",
     price: "1200.00",
     priceValue: 1200,
     negotiable: "NO",
     date: "2025-02-15",
     category: "Glass",
   },
   {
     id: "TASK-4488",
     name: "TASK-4488",
     status: "approved",
     isActive: true,
     shipping: "pending",
     price: "8000.00",
     priceValue: 8000,
     negotiable: "YES",
     date: "2025-01-30",
     category: "Metal",
   },
   {
     id: "TASK-3322",
     name: "TASK-3322",
     status: "approved",
     isActive: true,
     shipping: "shipped",
     price: "15000.00",
     priceValue: 15000,
     negotiable: "NO",
     date: "2025-01-15",
     category: "Steel",
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
 priceValue: number
 negotiable: string
 date: string
 category: string
}

export function ProductsTable() {
 const router = useRouter()
 const { toast } = useToast()
 const [sorting, setSorting] = React.useState<SortingState>([])
 const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
 const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

 // Advanced filtering states
 const [nameFilter, setNameFilter] = React.useState("")
 const [statusFilter, setStatusFilter] = React.useState("all")
 const [shippingFilter, setShippingFilter] = React.useState("all")
 const [priceFilter, setPriceFilter] = React.useState("all")
 const [negotiableFilter, setNegotiableFilter] = React.useState("all")
 const [categoryFilter, setCategoryFilter] = React.useState("all")

 // Categories state
 const [categories, setCategories] = React.useState<string[]>([
   "all",
   "Metal",
   "Plastic",
   "Paper",
   "Glass",
   "Steel",
 ])

 // Use the products store
 const { products, deleteProduct } = useProducts()

 // Clear all filters
 const clearAllFilters = () => {
   setNameFilter("")
   setStatusFilter("all")
   setShippingFilter("all")
   setPriceFilter("all")
   setNegotiableFilter("all")
   setCategoryFilter("all")
 }

 // Check if any filters are active
 const hasActiveFilters =
   nameFilter !== "" ||
   statusFilter !== "all" ||
   shippingFilter !== "all" ||
   priceFilter !== "all" ||
   negotiableFilter !== "all" ||
   categoryFilter !== "all"

 // Apply filters
 const filteredProducts = React.useMemo(() => {
   return products.filter((product) => {
     // Name filter
     if (nameFilter && !product.name.toLowerCase().includes(nameFilter.toLowerCase())) {
       return false
     }

     // Status filter
     if (statusFilter !== "all" && product.status !== statusFilter) {
       return false
     }

     // Shipping filter
     if (shippingFilter !== "all" && product.shipping !== shippingFilter) {
       return false
     }

     // Price filter
     if (priceFilter !== "all") {
       if (priceFilter === "low-high" || priceFilter === "high-low") {
         // These are sort options, not filters
         return true
       } else if (priceFilter === "under-1000" && product.priceValue >= 1000) {
         return false
       } else if (priceFilter === "1000-5000" && (product.priceValue < 1000 || product.priceValue > 5000)) {
         return false
       } else if (priceFilter === "over-5000" && product.priceValue <= 5000) {
         return false
       }
     }

     // Negotiable filter
     if (negotiableFilter !== "all") {
       const isNegotiable = product.negotiable === "YES"
       if (negotiableFilter === "yes" && !isNegotiable) {
         return false
       }
       if (negotiableFilter === "no" && isNegotiable) {
         return false
       }
     }

     // Category filter
     if (categoryFilter !== "all" && product.category !== categoryFilter) {
       return false
     }

     return true
   })
 }, [
   nameFilter,
   statusFilter,
   shippingFilter,
   priceFilter,
   negotiableFilter,
   products,
   categoryFilter,
 ])

 // Sort by price if needed
 const sortedProducts = React.useMemo(() => {
   if (priceFilter === "low-high") {
     return [...filteredProducts].sort((a, b) => a.priceValue - b.priceValue)
   } else if (priceFilter === "high-low") {
     return [...filteredProducts].sort((a, b) => b.priceValue - a.priceValue)
   }
   return filteredProducts
 }, [filteredProducts, priceFilter])

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
           {isActive ? "Active" : "Inactive"}
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
                 : shipping === "pending"
                   ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200"
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
   data: sortedProducts,
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

     <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
       <div className="w-full sm:w-auto">
         <div className="relative">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Filter by name..."
             className="w-full sm:w-[250px] pl-8"
             value={nameFilter}
             onChange={(e) => setNameFilter(e.target.value)}
           />
         </div>
       </div>
       <div className="flex flex-wrap gap-2 w-full sm:w-auto">
        

         <Select value={statusFilter} onValueChange={setStatusFilter}>
           <SelectTrigger className="w-full sm:w-[150px]">
             <SelectValue placeholder="Status" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Statuses</SelectItem>
             <SelectItem value="approved">Approved</SelectItem>
             <SelectItem value="not approved">Not Approved</SelectItem>
           </SelectContent>
         </Select>

         <Select value={shippingFilter} onValueChange={setShippingFilter}>
           <SelectTrigger className="w-full sm:w-[150px]">
             <SelectValue placeholder="Shipping" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Shipping</SelectItem>
             <SelectItem value="In Progress">In Progress</SelectItem>
             <SelectItem value="shipped">Shipped</SelectItem>
             <SelectItem value="pending">Pending</SelectItem>
           </SelectContent>
         </Select>

         <Select value={priceFilter} onValueChange={setPriceFilter}>
           <SelectTrigger className="w-full sm:w-[150px]">
             <SelectValue placeholder="Price" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Prices</SelectItem>
             <SelectItem value="low-high">Low to High</SelectItem>
             <SelectItem value="high-low">High to Low</SelectItem>
             <SelectItem value="under-1000">Under 1,000 DA</SelectItem>
             <SelectItem value="1000-5000">1,000 - 5,000 DA</SelectItem>
             <SelectItem value="over-5000">Over 5,000 DA</SelectItem>
           </SelectContent>
         </Select>

         <Select value={negotiableFilter} onValueChange={setNegotiableFilter}>
           <SelectTrigger className="w-full sm:w-[150px]">
             <SelectValue placeholder="Negotiable" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Negotiable</SelectItem>
             <SelectItem value="yes">Yes</SelectItem>
             <SelectItem value="no">No</SelectItem>
           </SelectContent>
         </Select>
       </div>
     </div>

     {hasActiveFilters && (
       <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
         <div className="flex flex-wrap gap-2 items-center">
           <span className="text-sm font-medium">Active filters:</span>

           {nameFilter && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Name: {nameFilter}
               <button onClick={() => setNameFilter("")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}

           {statusFilter !== "all" && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Status: {statusFilter}
               <button onClick={() => setStatusFilter("all")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}

           {shippingFilter !== "all" && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Shipping: {shippingFilter}
               <button onClick={() => setShippingFilter("all")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}

           {priceFilter !== "all" && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Price: {priceFilter}
               <button onClick={() => setPriceFilter("all")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}

           {negotiableFilter !== "all" && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Negotiable: {negotiableFilter}
               <button onClick={() => setNegotiableFilter("all")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}

           {categoryFilter !== "all" && (
             <Badge variant="secondary" className="flex items-center gap-1">
               Category: {categoryFilter}
               <button onClick={() => setCategoryFilter("all")} className="ml-1">
                 <X className="h-3 w-3" />
               </button>
             </Badge>
           )}
         </div>

         <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8">
           Clear all
         </Button>
       </div>
     )}

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

     <div className="flex items-center justify-between">
       <p className="text-sm text-muted-foreground">
         Showing {table.getRowModel().rows.length} of {products.length} products
       </p>
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
