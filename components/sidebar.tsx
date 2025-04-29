"use client";

import { useState, useEffect } from "react";
import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Heart,
  ShoppingCart,
  Settings,
  User,
  Building2,
  Bell,
  ChevronDown,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-provider";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  const [sellerExpanded, setSellerExpanded] = useState(true);
  const [buyerExpanded, setBuyerExpanded] = useState(true);
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);

  const [orderCounts, setOrderCounts] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });
  const { unreadCount } = useNotifications();

  // Effect to load order counts from localStorage
  useEffect(() => {
    const loadOrderCounts = () => {
      try {
        const storedCounts = localStorage.getItem("orderCounts");
        if (storedCounts) {
          const counts = JSON.parse(storedCounts);
          // Use the sidebarBadge property which contains only active orders
          setOrderCounts({
            ...counts,
            // For the sidebar badge, we only want to show active orders
            total: counts.sidebarBadge || counts.active || 0,
          });
        }
      } catch (error) {
        console.error("Error loading order counts:", error);
      }
    };

    // Load initial counts
    loadOrderCounts();

    // Set up event listeners for both storage changes and custom events
    const handleStorageChange = () => loadOrderCounts();
    window.addEventListener("storage", handleStorageChange);

    // Listen for the custom event for real-time updates
    const handleOrderCountsUpdated = (event: CustomEvent) => {
      if (event.detail) {
        setOrderCounts({
          ...event.detail,
          // For the sidebar badge, we only want to show active orders
          total: event.detail.sidebarBadge || event.detail.active || 0,
        });
      }
    };

    window.addEventListener(
      "orderCountsUpdated",
      handleOrderCountsUpdated as EventListener,
    );

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "orderCountsUpdated",
        handleOrderCountsUpdated as EventListener,
      );
    };
  }, []);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300",
        isOpen
          ? "w-[240px]"
          : "w-0 -translate-x-full md:w-[60px] md:translate-x-0",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center">
            <Settings className="h-4 w-4 text-foreground" />
          </div>
          <h1 className={cn("text-xl font-bold", !isOpen && "md:hidden")}>
            Dashboard
          </h1>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <div className="space-y-4 px-3">
            {/* Seller Section */}
            <div>
              <h2
                className={cn(
                  "mb-2 px-2 text-xs font-semibold tracking-tight",
                  !isOpen && "md:hidden",
                )}
              >
                Seller
              </h2>
              <nav className="space-y-1">
                <NavItem
                  href="/overview"
                  icon={LayoutDashboard}
                  label="Overview"
                  isOpen={isOpen}
                  isActive={pathname === "/overview" || pathname === "/"}
                />
                <NavItem
                  href="/products"
                  icon={Package}
                  label="Products"
                  isOpen={isOpen}
                  isActive={pathname.startsWith("/products")}
                />
                <NavItem
                  href="/requests"
                  icon={MessageSquare}
                  label="Requests"
                  isOpen={isOpen}
                  isActive={pathname.startsWith("/requests")}
                  badge={3}
                />
              </nav>
            </div>
            {/* Buyer Section */}
            <div>
              <div className="mb-2 flex items-center justify-between px-2">
                <h2
                  className={cn(
                    "text-xs font-semibold tracking-tight",
                    !isOpen && "md:hidden",
                  )}
                >
                  Buyer
                </h2>
                {isOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => setBuyerExpanded(!buyerExpanded)}
                  >
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        !buyerExpanded && "-rotate-90",
                      )}
                    />
                    <span className="sr-only">Toggle buyer section</span>
                  </Button>
                )}
              </div>

              {(buyerExpanded || !isOpen) && (
                <nav className="space-y-1">
                  <NavItem
                    href="/buyer"
                    icon={LayoutDashboard}
                    label="Overview"
                    isOpen={isOpen}
                    isActive={pathname === "/buyer"}
                  />
                  <NavItem
                    href="/buyer/orders"
                    icon={Package}
                    label="Orders"
                    isOpen={isOpen}
                    isActive={pathname.startsWith("/buyer/orders")}
                    badge={orderCounts.total}
                  />
                  <NavItem
                    href="/buyer/history"
                    icon={Clock}
                    label="History"
                    isOpen={isOpen}
                    isActive={pathname.startsWith("/buyer/history")}
                  />
                  <div className="relative">
                    <div
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname.startsWith("/buyer/favorites") ||
                          pathname.startsWith("/buyer/favorite-sellers")
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground",
                        !isOpen && "md:justify-center",
                      )}
                      onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                    >
                      <Heart className="h-5 w-5 flex-shrink-0" />
                      <span className={cn("grow", !isOpen && "md:hidden")}>
                        Favorites
                      </span>
                      {isOpen && (
                        <ChevronRight
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-transform",
                            favoritesExpanded && "rotate-90",
                          )}
                        />
                      )}
                    </div>

                    {isOpen && favoritesExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        <Link
                          href="/buyer/favorites"
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith("/buyer/favorites")
                              ? "bg-accent/50 text-accent-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <Heart className="h-5 w-5 flex-shrink-0" />
                          <span>Products</span>
                        </Link>
                        <Link
                          href="/buyer/favorite-sellers"
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith("/buyer/favorite-sellers")
                              ? "bg-accent/50 text-accent-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <Building2 className="h-5 w-5 flex-shrink-0" />
                          <span>Sellers</span>
                        </Link>
                      </div>
                    )}
                  </div>
                  {/*
                  <NavItem
                    href="/buyer/recommendations"
                    icon={Sparkles}
                    label="For You"
                    isOpen={isOpen}
                    isActive={pathname.startsWith("/buyer/recommendations")}
                  />
                  */}
                  <NavItem
                    href="/buyer/cart"
                    icon={ShoppingCart}
                    label="Cart"
                    isOpen={isOpen}
                    isActive={pathname.startsWith("/buyer/cart")}
                    badge={1}
                  />
                </nav>
              )}
            </div>

            {/* Settings Section */}
            <div>
              <h2
                className={cn(
                  "mb-2 px-2 text-xs font-semibold tracking-tight",
                  !isOpen && "md:hidden",
                )}
              >
                Settings
              </h2>
              <nav className="space-y-1">
                <NavItemWithSubmenu
                  href="/settings"
                  icon={Settings}
                  label="Settings"
                  isOpen={isOpen}
                  isActive={pathname.startsWith("/settings")}
                  submenuItems={[
                    { href: "/profile", label: "Profile", icon: User },
                    {
                      href: "/organization",
                      label: "Organization",
                      icon: Building2,
                    },
                  ]}
                />
              </nav>
            </div>
            {/* Notifications Section */}
            <div>
              <nav className="space-y-1">
                <NavItem
                  href="/notifications"
                  icon={Bell}
                  label="Notifications"
                  isOpen={isOpen}
                  isActive={pathname.startsWith("/notifications")}
                  badge={unreadCount > 0 ? unreadCount : undefined}
                />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  label: string;
  isOpen: boolean;
  isActive: boolean;
  badge?: number;
};

function NavItem({
  href,
  icon: Icon,
  label,
  isOpen,
  isActive,
  badge,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        !isOpen && "md:justify-center",
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className={cn("grow", !isOpen && "md:hidden")}>{label}</span>
      {badge && (
        <span
          className={cn(
            "ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground",
            !isOpen && "md:hidden",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

type NavItemWithSubmenuProps = NavItemProps & {
  submenuItems: {
    href: string;
    label: string;
    icon: React.ElementType;
  }[];
};

function NavItemWithSubmenu({
  href,
  icon: Icon,
  label,
  isOpen,
  isActive,
  submenuItems,
}: NavItemWithSubmenuProps) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={href}
          className={cn(
            "flex grow items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
            !isOpen && "md:justify-center",
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className={cn("grow", !isOpen && "md:hidden")}>{label}</span>
        </Link>
        {isOpen && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform",
                isSubmenuOpen && "rotate-180",
              )}
            />
            <span className="sr-only">Toggle submenu</span>
          </Button>
        )}
      </div>

      {isOpen && isSubmenuOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {submenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent/50 text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
