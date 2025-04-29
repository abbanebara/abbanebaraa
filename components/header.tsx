"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <>
      <div className="justify-center items-center bg-[#003731] p-2">
        <div className="flex flex-row justify-between items-center w-full max-w-7xl">
          <span className="flex md:flex-row flex-col justify-center md:justify-start items-start md:items-center md:gap-2 -space-y-0.5 w-full text-primary-foreground text-xs">
            <p>+213 540629662</p>
            <p className="hidden md:block">|</p>
            <p>ia7636hs@gmail.com</p>
          </span>

          <span className="flex md:flex-row flex-col justify-center md:justify-end items-end md:items-center md:gap-2 -space-y-0.5 md:space-y-0 w-full text-primary-foreground text-xs text-center capitalize">
            <Link className="hover:underline" href={"/"}>
              terms and conditions
            </Link>
            <p className="hidden md:block">|</p>
            <Link className="font-sans hover:underline" href={"/"}>
              contact us
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};