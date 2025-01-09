"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { clsx } from "clsx";
import { Abril_Fatface } from "next/font/google";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const abril = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
});

const Links = [
  {
    label: "Positions",
    href: "positions",
    item: [
      {
        label: "Manage",
        href: "/positions/manage",
      },
      {
        label: "Create",
        href: "/positions/create",
      },
    ],
  },
  {
    label: "Faucet",
    href: "/faucet",
  },
];

export const Header = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();

  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4">
      <div className="flex items-center">
        <Link href="/">
          <h1
            className={clsx(
              abril.className,
              "text-3xl font-semibold italic leading-6 text-[#7a0133]"
            )}
          >
            Voilatile
          </h1>
        </Link>

        <ul className="items-center gap-4 ml-9 hidden md:flex">
          {Links.map((link) =>
            link.item && link.item.length > 0 && link.href ? (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <div
                    onDoubleClick={() =>
                      (window.location.href = "/positions/manage")
                    }
                    className={
                      "text-gray-400 hover:text-gray-700 cursor-pointer select-none"
                    }
                  >
                    {link.label}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-1 sm:p-1 shadow-none sm:shadow-none">
                  <div className="flex flex-col gap-1 min-w-28">
                    {link.item?.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={clsx(
                          "text-gray-400 hover:text-gray-700 hover:bg-gray-50 px-2 py-2 rounded",
                          pathname === item.href && "text-gray-700 font-medium"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={clsx(
                  "text-gray-400 hover:text-gray-700 select-none",
                  pathname === link.href && "text-gray-700 font-medium"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </ul>
      </div>

      <div className="flex items-center gap-1">
        {address ? (
          <Button
            onClick={openAccountModal}
            className="rounded-full bg-transparent text-black hover:bg-gray-50 border border-gray-200"
          >
            <Image
              src="/assets/images/wallet.svg"
              alt="wallet"
              width={20}
              height={20}
            />
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
        ) : (
          <Button onClick={openConnectModal} className="rounded-full">
            Connect
          </Button>
        )}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-2 pt-4">
              {Links.map((link) =>
                link.item && link.item.length > 0 && link.href ? (
                  <div key={link.label} className="flex flex-col">
                    <span className="text-gray-500 text-base font-medium px-4 py-1">
                      {link.label}
                    </span>
                    <div className="flex flex-col mt-1">
                      {link.item?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={clsx(
                            "flex items-center gap-2 text-gray-400 hover:text-gray-700 text-base py-2 px-6 rounded-lg transition-colors",
                            pathname === item.href &&
                              "text-gray-700 font-medium bg-gray-50"
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-2 text-gray-400 hover:text-gray-700 text-base py-2 px-4 rounded-lg transition-colors",
                      pathname === link.href &&
                        "text-gray-700 font-medium bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
