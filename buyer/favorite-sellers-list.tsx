"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Building2, MapPin, Phone, Mail, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define seller type for better type safety
export interface Seller {
  id: string;
  username: string;
  avatar: string;
  specialization: string;
  subscriptionTier: "Pro" | "Standard";
  productCount: number;
  location: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
}

export function FavoriteSellersList() {
  const { toast } = useToast();
  const [favoriteSellers, setFavoriteSellers] = useState<Seller[]>([
    {
      id: "1",
      username: "metal_master_21",
      avatar: "/placeholder.svg?height=40&width=40",
      specialization: "Industrial Metal Processing",
      subscriptionTier: "Pro",
      productCount: 24,
      location: {
        city: "Algiers",
        address: "123 Industrial Zone, Rouiba",
        coordinates: {
          lat: 36.7372,
          lng: 3.2599,
        },
      },
      contact: {
        phone: "+213 555 123 456",
        email: "contact@metalmaster.dz",
      },
    },
    {
      id: "3",
      username: "steel_works_const",
      avatar: "/placeholder.svg?height=40&width=40",
      specialization: "Construction Materials",
      subscriptionTier: "Pro",
      productCount: 32,
      location: {
        city: "Constantine",
        address: "45 Manufacturing District, Constantine",
        coordinates: {
          lat: 36.365,
          lng: 6.6147,
        },
      },
      contact: {
        phone: "+213 555 789 012",
        email: "info@steelworks.dz",
      },
    },
    {
      id: "5",
      username: "eco_recyclers",
      avatar: "/placeholder.svg?height=40&width=40",
      specialization: "Sustainable Materials",
      subscriptionTier: "Standard",
      productCount: 21,
      location: {
        city: "Annaba",
        address: "78 Green Zone, Annaba",
        coordinates: {
          lat: 36.9142,
          lng: 7.7427,
        },
      },
      contact: {
        phone: "+213 555 345 678",
        email: "support@ecorecyclers.dz",
      },
    },
  ]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(["1", "3", "5"]);

  // Handle favorite toggle with animation and toast notification
  const handleFavoriteToggle = (seller: Seller) => {
    const isFavorited = favoriteIds.includes(seller.id);
    let updatedFavorites: string[];

    if (isFavorited) {
      updatedFavorites = favoriteIds.filter((id) => id !== seller.id);
      setFavoriteSellers(favoriteSellers.filter((s) => s.id !== seller.id));
    } else {
      updatedFavorites = [...favoriteIds, seller.id];
      // In a real app, we would fetch the seller data
    }

    setFavoriteIds(updatedFavorites);
    localStorage.setItem("favoriteSellers", JSON.stringify(updatedFavorites));

    // Show toast notification
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited
        ? `${seller.username} has been removed from your favorite sellers.`
        : `${seller.username} has been added to your favorite sellers.`,
      duration: 3000,
    });
  };

  if (favoriteSellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/10 py-12">
        <Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">No favorite sellers yet</h3>
        <p className="mb-6 max-w-md text-center text-muted-foreground">
          Browse products and follow sellers to add them to your favorites for
          easy access later.
        </p>
        <Button asChild>
          <Link href="/buyer/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {favoriteSellers.map((seller) => (
        <Card key={seller.id} className="group overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={seller.avatar} alt={seller.username} />
                  <AvatarFallback>
                    {seller.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">@{seller.username}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          seller.subscriptionTier === "Pro"
                            ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-50",
                        )}
                      >
                        {seller.subscriptionTier}
                      </Badge>
                    </div>
                    <FavoriteButton
                      sellerId={seller.id}
                      isFavorited={favoriteIds.includes(seller.id)}
                      onClick={() => handleFavoriteToggle(seller)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {seller.specialization}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Products</p>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{seller.productCount}</span>
                  </div>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="group w-full transition-colors hover:bg-muted"
                      >
                        Location
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Seller Location</DialogTitle>
                        <DialogDescription>
                          Location details for @{seller.username}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-2 space-y-4">
                        <div className="rounded-md border bg-muted/50 p-4">
                          <h4 className="mb-2 flex items-center font-medium">
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            Address
                          </h4>
                          <p>{seller.location.address}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {seller.location.city}
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="group w-full transition-colors hover:bg-primary/90">
                      <Phone className="mr-2 h-4 w-4 transition-colors group-hover:text-white" />
                      Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Contact Information</DialogTitle>
                      <DialogDescription>
                        Contact details for @{seller.username}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{seller.contact.phone}</p>
                          <p className="text-sm text-muted-foreground">Phone</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{seller.contact.email}</p>
                          <p className="text-sm text-muted-foreground">Email</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface FavoriteButtonProps {
  sellerId: string;
  isFavorited: boolean;
  onClick: () => void;
}

function FavoriteButton({
  sellerId,
  isFavorited,
  onClick,
}: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "transform rounded-full transition-all duration-300",
        isFavorited
          ? "bg-red-100 text-red-500 hover:scale-110 hover:bg-red-200"
          : "hover:scale-110 hover:bg-red-50 hover:text-red-500",
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isFavorited && "fill-red-500 text-red-500",
        )}
      />
      <span className="sr-only">
        {isFavorited ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
}
