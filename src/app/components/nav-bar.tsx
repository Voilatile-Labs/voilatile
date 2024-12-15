"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const NavBarLink = [
  {
    label: "Trade",
    href: "/trade",
  },
  {
    label: "Explore",
    href: "/explore",
  },
  {
    label: "Pool",
    href: "/pool",
  },
];

export const NavBar = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-6">
        {NavBarLink.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-medium text-gray-400 hover:text-gray-700"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="relative flex-1 max-w-sm mx-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search tokens"
          className="pl-10 w-full rounded-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-full">
          Get the app
        </Button>
        {address ? (
          <Button onClick={openAccountModal} className="rounded-full">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </Button>
        ) : (
          <Button onClick={openConnectModal} className="rounded-full">
            Connect
          </Button>
        )}
      </div>
    </nav>
  );
};
