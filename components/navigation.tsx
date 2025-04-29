"use client";

import { cn } from "@/lib/utils";
import { navbarItems } from "@/lib";
import { Bilgreen } from "@/components/bilgreen";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { AlignLeft, Earth, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  title: string;
  href: string;
  active?: boolean;
}

const NavLink = ({ title, href, active = false }: NavLinkProps) => {
  return (
    <Link
      className={cn(
        "group relative md:font-medium font-semibold md:text-base text-2xl text-left capitalize",
        {
          "text-primary": active,
          "text-muted-foreground hover:text-primary": !active,
        }
      )}
      href={href}
    >
      {title}
      <div
        className={cn(
          "absolute bg-[#4BB96A] w-0 h-[2.5px] md:h-0.5 duration-300",
          {
            "w-full": active,
            "group-hover:w-full": !active,
          }
        )}
      />
    </Link>
  );
};

const DesktopNavigation = () => {
  const pathName = usePathname();
  return (
    <>
      <div className="flex justify-center items-center p-4">
        <div className="flex justify-center items-center gap-4 xl:gap-8 px-2 w-full max-w-7xl">
          <Link
            href={"/"}
            className="flex flex-grow-0 flex-shrink-0 justify-center items-center gap-1"
          >
            <Bilgreen className="size-8" />
            <p className="text-3xl">Bilgreen</p>
          </Link>

          <div className="hidden relative md:flex flex-grow justify-start items-center gap-2 lg:gap-4 xl:gap-5">
            {navbarItems.map((item, index) => {
              const isActive =
                pathName === item.href ||
                (pathName.startsWith(item.href) && item.href !== "/");
              return (
                <NavLink
                  href={item.href}
                  title={item.title}
                  active={isActive}
                  key={index}
                />
              );
            })}
          </div>

          <div className="flex flex-grow-0 flex-shrink-0 justify-center items-center gap-2">
      
            <a href="/overview"> <Button className="bg-[#4BB96A] hover:bg-[#4BB96A]/90">  dashboard </Button></a>
            
          </div>
        </div>
      </div>
    </>
  );
};

const MobileNavigation = () => {
  const pathName = usePathname();
  return (
    <>
      <div className="flex justify-between items-center p-4 ">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size={"icon"}
              variant={"default"}
              className="bg-[#4BB96A] hover:bg-[#4BB96A]/90"
            >
              <AlignLeft />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col *:p-2 outline h-svh">
            <SheetHeader className="flex-0">
              <SheetTitle className="flex justify-start items-center gap-2 [&_svg]:size-8 font-display font-normal text-primary text-2xl text-left uppercase">
                <Bilgreen />
                Bilgreen
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col flex-1 justify-center items-center gap-12">
              {navbarItems.map((item, index) => {
                const isActive =
                  pathName === item.href ||
                  (pathName.startsWith(item.href) && item.href !== "/");
                return (
                  <NavLink
                    href={item.href}
                    title={item.title}
                    active={isActive}
                    key={index}
                  />
                );
              })}
            </div>
            <SheetFooter className="flex-row flex-grow-0 flex-shrink-0 justify-stretch items-center gap-4 w-full">
              <Button variant={"outline"} size={"default"} className="w-full">
                <ShoppingCart />
                Basket
              </Button>
              <Button variant={"outline"} size={"default"} className="w-full">
                <Earth />
                English
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Button className="bg-[#4BB96A] hover:bg-[#4BB96A]/90">dashbord</Button>
      </div>
    </>
  );
};

const Navigation = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && <MobileNavigation />}
      {!isMobile && <DesktopNavigation />}
    </>
  );
};

export { Navigation };
