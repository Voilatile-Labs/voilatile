"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { Menu, Triangle } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import GithubIcon from "@/assets/icons/github";
import TwitterIcon from "@/assets/icons/twitter";
// import DiscordIcon from "@/assets/icons/discord";
import { socialIconHoverAnimation } from "./footer";

const PageLinks: {
  label?: string;
  href?: string;
  item: {
    label: string;
    href: string;
  }[];
}[] = [
  {
    // label: "Company",
    // href: "company",
    item: [
      {
        label: "About us",
        href: "#about-us",
      },
      {
        label: "Schedule a call",
        href: "#schedule-call",
      },
    ],
  },
  {
    // label: "Protocol",
    // href: "protocol",
    item: [
      {
        label: "Documentation",
        href: "#documentation",
      },
    ],
  },
];

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
        <div>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Link href="/">
                  <div className="relative items-center w-32 h-8 flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/images/logo.gif"
                      alt="logo"
                      className="absolute mt-4"
                    />
                  </div>
                </Link>
                <Triangle className="w-2 h-2 transform rotate-180 fill-gray-400 hover:fill-black transition-all duration-300" />
              </div>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="p-4 sm:p-4 shadow-none sm:shadow-none"
            >
              <ul className="flex flex-col gap-2 min-w-40">
                {PageLinks.map((item) => (
                  <li key={item.label}>
                    {item.label && (
                      <p className="text-black text-sm font-medium mb-2">
                        {item.label}
                      </p>
                    )}
                    <ul className="flex flex-col gap-2">
                      {item.item?.map((element) => (
                        <Link
                          key={element.label}
                          href={element.href}
                          className={cn("text-gray-500 hover:text-gray-900")}
                        >
                          {element.label}
                        </Link>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 mt-5">
                <motion.a
                  href="https://github.com/Voilatile-Labs"
                  aria-label="GitHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...socialIconHoverAnimation}
                >
                  <GithubIcon className="w-[22px] h-[22px] hover:fill-blue-500" />
                </motion.a>
                <motion.a
                  href="https://x.com/VoilatileLabs"
                  aria-label="X"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...socialIconHoverAnimation}
                >
                  <TwitterIcon className="w-[20px] h-[20px] hover:fill-blue-500" />
                </motion.a>
                {/* <motion.a
                  href="#"
                  aria-label="Discord"
                  {...socialIconHoverAnimation}
                >
                  <DiscordIcon className="w-[20px] h-[20px] hover:fill-blue-500" />
                </motion.a> */}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        <ul className="items-center gap-4 ml-9 hidden md:flex">
          {Links.map((link) =>
            link.item && link.item.length > 0 && link.href ? (
              <Tooltip key={link.label} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    onDoubleClick={() =>
                      (window.location.href = "/positions/manage")
                    }
                    className={cn(
                      "text-gray-500 hover:text-gray-900 select-none cursor-pointer",
                      pathname.includes(link.href) &&
                        "text-gray-900 font-medium"
                    )}
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
                        className={cn(
                          "text-gray-500 hover:text-gray-900 hover:bg-primary/5 px-2 py-2 rounded",
                          pathname === item.href && "text-gray-900 font-medium"
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
                className={cn(
                  "text-gray-500 hover:text-gray-900 select-none",
                  pathname === link.href && "text-gray-900 font-medium"
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
            className="rounded-full bg-transparent text-black hover:bg-gray-50 border border-gray-200 px-3"
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
          <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl px-2">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-2 pt-4">
              {Links.map((link) =>
                link.item && link.item.length > 0 && link.href ? (
                  <div key={link.label} className="flex flex-col">
                    <span className="text-gray-600 text-base font-medium px-4 py-1">
                      {link.label}
                    </span>
                    <div className="flex flex-col mt-1">
                      {link.item?.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 text-gray-500 hover:text-gray-900 text-base py-2 px-6 rounded-lg transition-colors",
                            pathname === item.href &&
                              "text-gray-900 font-medium bg-primary/10"
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
                    className={cn(
                      "flex items-center gap-2 text-gray-500 hover:text-gray-900 text-base py-2 px-4 rounded-lg transition-colors",
                      pathname === link.href &&
                        "text-gray-900 font-medium bg-primary/10"
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
