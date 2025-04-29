import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavLinkProps {
  title?: string;
  href?: string;
  active?: boolean;
}

export const navbarItems = [
  {
    title: "home",
    href: "/",
  },
  {
    title: "scrap",
    href: "/scrap",
  },
  {
    title: "blog",
    href: "/blog",
  },
  {
    title: "about us",
    href: "/about",
  },
];

export const NavLink = ({ title, href, active = false }: NavLinkProps) => {
  return (
    <Link
      className={cn(
        "group relative text-left text-2xl font-semibold lowercase md:text-base md:font-medium",
        {
          "text-primary": active,
          "text-muted-foreground hover:text-primary": !active,
        },
      )}
      href={href ?? "/"}
    >
      {title}
      <div
        className={cn("bg-primary absolute h-[3px] w-0 duration-300 md:h-0.5", {
          "w-full": active,
          "group-hover:w-full": !active,
        })}
      />
    </Link>
  );
};
