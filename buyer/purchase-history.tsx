"use client";

import { AlertDialogAction } from "@/components/ui/alert-dialog";

import { AlertDialogCancel } from "@/components/ui/alert-dialog";

import { AlertDialogFooter } from "@/components/ui/alert-dialog";

import { AlertDialogDescription } from "@/components/ui/alert-dialog";

import { AlertDialogTitle } from "@/components/ui/alert-dialog";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";

import { AlertDialogContent } from "@/components/ui/alert-dialog";

import { AlertDialog } from "@/components/ui/alert-dialog";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  X,
  CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  format,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function PurchaseHistory() {
  const { toast } = useToast();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [shippingFilter, setShippingFilter] = useState("all");
  const [priceFilter, setpriceFilter] = useState("all");
  const [negotiableFilter, setNegotiableFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedPurchase, setSelectedPurchase] = useState<
    (typeof purchases)[0] | null
  >(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Sample data
  const purchases = [
    {
      id: "1",
      name: "Plastic Scraps",
      status: "buyed",
      shipping: "shipped",
      price: "10000.00 DA",
      priceValue: 10000,
      negotiable: "YES",
      date: "2025-03-15",
    },
    {
      id: "2",
      name: "Metal Sheets",
      status: "pending",
      shipping: "pending",
      price: "15000.00 DA",
      priceValue: 15000,
      negotiable: "YES",
      date: "2025-03-10",
    },
    {
      id: "3",
      name: "Copper Wire",
      status: "buyed",
      shipping: "shipped",
      price: "25000.00 DA",
      priceValue: 25000,
      negotiable: "YES",
      date: "2025-02-28",
    },
    {
      id: "4",
      name: "Aluminum Scrap",
      status: "cancelled",
      shipping: "cancelled",
      price: "8000.00 DA",
      priceValue: 8000,
      negotiable: "YES",
      date: "2025-02-20",
    },
    {
      id: "5",
      name: "Paper Waste",
      status: "buyed",
      shipping: "shipped",
      price: "5000.00 DA",
      priceValue: 5000,
      negotiable: "YES",
      date: "2025-02-15",
    },
    {
      id: "6",
      name: "Glass Bottles",
      status: "banned",
      shipping: "cancelled",
      price: "12000.00 DA",
      priceValue: 12000,
      negotiable: "NO",
      date: "2025-01-30",
    },
    {
      id: "7",
      name: "Steel Coils",
      status: "delivered",
      shipping: "shipped",
      price: "30000.00 DA",
      priceValue: 30000,
      negotiable: "YES",
      date: "2025-01-15",
    },
    {
      id: "8",
      name: "Rubber Tires",
      status: "buyed",
      shipping: "in-progress",
      price: "18000.00 DA",
      priceValue: 18000,
      negotiable: "NO",
      date: "2024-12-20",
    },
  ];

  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const clearAllFilters = () => {
    setNameFilter("");
    setStatusFilter("all");
    setShippingFilter("all");
    setpriceFilter("all");
    setNegotiableFilter("all");
    setDateFilter("all");
    setDateRange({ from: undefined, to: undefined });
  };

  const exportToExcel = () => {
    try {
      // Format data for export
      const dataToExport = sortedPurchases.map((purchase) => ({
        Name: purchase.name,
        Status: purchase.status,
        Shipping: purchase.shipping,
        Price: purchase.price,
        Negotiable: purchase.negotiable,
        Date: purchase.date,
      }));

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Add headers
      const headers = Object.keys(dataToExport[0] || {});
      csvContent += headers.join(",") + "\n";

      // Add data rows
      dataToExport.forEach((row) => {
        const rowValues = headers.map((header) => {
          const value = row[header] || "";
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += rowValues.join(",") + "\n";
      });

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `purchase_history_${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Purchase history has been exported to purchase_history_${format(new Date(), "yyyy-MM-dd")}.csv`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description:
          "There was an error exporting your data. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Apply filters
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      // Name filter
      if (
        nameFilter &&
        !purchase.name.toLowerCase().includes(nameFilter.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && purchase.status !== statusFilter) {
        return false;
      }

      // Shipping filter
      if (shippingFilter !== "all" && purchase.shipping !== shippingFilter) {
        return false;
      }

      // Price filter
      if (priceFilter !== "all") {
        if (priceFilter === "low-high" || priceFilter === "high-low") {
          // These are sort options, not filters
          return true;
        } else if (
          priceFilter === "under-5000" &&
          purchase.priceValue >= 5000
        ) {
          return false;
        } else if (
          priceFilter === "5000-10000" &&
          (purchase.priceValue < 5000 || purchase.priceValue > 10000)
        ) {
          return false;
        } else if (
          priceFilter === "over-10000" &&
          purchase.priceValue <= 10000
        ) {
          return false;
        }
      }

      // Negotiable filter
      if (negotiableFilter !== "all") {
        const isNegotiable = purchase.negotiable === "YES";
        if (negotiableFilter === "yes" && !isNegotiable) {
          return false;
        }
        if (negotiableFilter === "no" && isNegotiable) {
          return false;
        }
      }

      // Date filter
      const purchaseDate = parseISO(purchase.date);
      if (dateFilter !== "all") {
        const today = new Date();

        if (dateFilter === "today") {
          const startOfToday = startOfDay(today);
          const endOfToday = endOfDay(today);
          return (
            !isBefore(purchaseDate, startOfToday) &&
            !isAfter(purchaseDate, endOfToday)
          );
        } else if (dateFilter === "last7days") {
          const last7Days = subDays(today, 7);
          return !isBefore(purchaseDate, startOfDay(last7Days));
        } else if (dateFilter === "last30days") {
          const last30Days = subDays(today, 30);
          return !isBefore(purchaseDate, startOfDay(last30Days));
        } else if (dateFilter === "thisMonth") {
          const firstDayOfMonth = startOfMonth(today);
          const lastDayOfMonth = endOfMonth(today);
          return (
            !isBefore(purchaseDate, firstDayOfMonth) &&
            !isAfter(purchaseDate, lastDayOfMonth)
          );
        } else if (
          dateFilter === "custom" &&
          (dateRange.from || dateRange.to)
        ) {
          if (dateRange.from && dateRange.to) {
            return (
              !isBefore(purchaseDate, startOfDay(dateRange.from)) &&
              !isAfter(purchaseDate, endOfDay(dateRange.to))
            );
          } else if (dateRange.from) {
            return !isBefore(purchaseDate, startOfDay(dateRange.from));
          } else if (dateRange.to) {
            return !isAfter(purchaseDate, endOfDay(dateRange.to));
          }
        }
      }

      return true;
    });
  }, [
    nameFilter,
    statusFilter,
    shippingFilter,
    priceFilter,
    negotiableFilter,
    dateFilter,
    dateRange,
    purchases,
  ]);

  // Sort by price if needed
  const sortedPurchases = useMemo(() => {
    if (priceFilter === "low-high") {
      return [...filteredPurchases].sort((a, b) => a.priceValue - b.priceValue);
    } else if (priceFilter === "high-low") {
      return [...filteredPurchases].sort((a, b) => b.priceValue - a.priceValue);
    }
    return filteredPurchases;
  }, [filteredPurchases, priceFilter]);

  // Pagination
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage);
  const paginatedPurchases = sortedPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const hasActiveFilters =
    nameFilter !== "" ||
    statusFilter !== "all" ||
    shippingFilter !== "all" ||
    priceFilter !== "all" ||
    negotiableFilter !== "all" ||
    dateFilter !== "all" ||
    dateRange.from !== undefined ||
    dateRange.to !== undefined;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "buyed":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Buyed
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
          >
            Pending
          </Badge>
        );
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            Shipped
          </Badge>
        );
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
          >
            Cancelled
          </Badge>
        );
      case "banned":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
          >
            Banned
          </Badge>
        );
      default:
        return status;
    }
  };

  const getShippingBadge = (shipping: string) => {
    switch (shipping) {
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Shipped
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
          >
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-50"
          >
            Cancelled
          </Badge>
        );
      default:
        return shipping;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">History</h2>
          <p className="text-muted-foreground">
            Here's a list of your previous products
          </p>
        </div>
        <Button onClick={exportToExcel} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Extract
        </Button>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Filter by name..."
            className="w-full sm:w-[250px]"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="buyed">Buyed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select value={shippingFilter} onValueChange={setShippingFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Shipping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shipping</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={setpriceFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="low-high">Low to High</SelectItem>
              <SelectItem value="high-low">High to Low</SelectItem>
              <SelectItem value="under-5000">Under 5,000 DA</SelectItem>
              <SelectItem value="5000-10000">5,000 - 10,000 DA</SelectItem>
              <SelectItem value="over-10000">Over 10,000 DA</SelectItem>
            </SelectContent>
          </Select>

          <Select value={negotiableFilter} onValueChange={setNegotiableFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Negotiable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Negotiable</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={(value) => {
              setDateFilter(value);
              if (value !== "custom") {
                setDateRange({ from: undefined, to: undefined });
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {dateFilter === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between rounded-md bg-muted/30 p-2">
          <div className="flex flex-wrap items-center gap-2">
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
                <button
                  onClick={() => setShippingFilter("all")}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {priceFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: {priceFilter}
                <button onClick={() => setpriceFilter("all")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {negotiableFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Negotiable: {negotiableFilter}
                <button
                  onClick={() => setNegotiableFilter("all")}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {dateFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date:{" "}
                {dateFilter === "custom" && dateRange.from
                  ? `${dateRange.from ? format(dateRange.from, "MM/dd/yyyy") : ""} - ${dateRange.to ? format(dateRange.to, "MM/dd/yyyy") : ""}`
                  : dateFilter}
                <button
                  onClick={() => {
                    setDateFilter("all");
                    setDateRange({ from: undefined, to: undefined });
                  }}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8"
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Negotiable</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPurchases.length > 0 ? (
              paginatedPurchases.map((purchase) => (
                <TableRow
                  key={purchase.id}
                  className="cursor-pointer"
                  onClick={() => toggleRowSelection(purchase.id)}
                  data-selected={selectedRows.includes(purchase.id)}
                >
                  <TableCell className="font-medium">{purchase.name}</TableCell>
                  <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                  <TableCell>{getShippingBadge(purchase.shipping)}</TableCell>
                  <TableCell>{purchase.price}</TableCell>
                  <TableCell>{purchase.negotiable}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPurchase(purchase);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {sortedPurchases.length} row(s) selected.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
      {/* Product View Dialog */}
      <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {selectedPurchase?.name}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium text-foreground">Status:</div>
                  <div>
                    {selectedPurchase &&
                      getStatusBadge(selectedPurchase.status)}
                  </div>

                  <div className="font-medium text-foreground">Shipping:</div>
                  <div>
                    {selectedPurchase &&
                      getShippingBadge(selectedPurchase.shipping)}
                  </div>

                  <div className="font-medium text-foreground">Price:</div>
                  <div>{selectedPurchase?.price}</div>

                  <div className="font-medium text-foreground">Negotiable:</div>
                  <div>{selectedPurchase?.negotiable}</div>

                  <div className="font-medium text-foreground">
                    Purchase Date:
                  </div>
                  <div>{selectedPurchase?.date}</div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="mb-1 font-medium text-foreground">
                    Product Description
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This is a detailed description of the{" "}
                    {selectedPurchase?.name.toLowerCase()}. It includes
                    information about the quality, quantity, and specifications
                    of the product.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
