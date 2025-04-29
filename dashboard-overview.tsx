"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react"
import { Chart } from "@/components/ui/chart"

export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
        <CardFooter>
          <Link href="/revenue" className="text-xs text-muted-foreground hover:underline">
            View report <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
        <CardFooter>
          <Link href="/subscriptions" className="text-xs text-muted-foreground hover:underline">
            View report <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12,234</div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
        </CardContent>
        <CardFooter>
          <Link href="/sales" className="text-xs text-muted-foreground hover:underline">
            View report <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
        <CardFooter>
          <Link href="/active" className="text-xs text-muted-foreground hover:underline">
            View report <ArrowUpRight className="ml-1 inline-block h-3 w-3" />
          </Link>
        </CardFooter>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>&</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <Chart />
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>You made 265 sales this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10" />
                <div>
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                </div>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10" />
                <div>
                  <p className="text-sm font-medium leading-none">Jackson Lee</p>
                  <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
                </div>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10" />
                <div>
                  <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                  <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
                </div>
              </div>
              <div className="ml-auto font-medium">+$299.00</div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10" />
                <div>
                  <p className="text-sm font-medium leading-none">William Kim</p>
                  <p className="text-sm text-muted-foreground">will@email.com</p>
                </div>
              </div>
              <div className="ml-auto font-medium">+$99.00</div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/sales">
              View All Sales <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
    </div>
  )
}

