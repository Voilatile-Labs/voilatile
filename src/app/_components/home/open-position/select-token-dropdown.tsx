"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SelectTokenModal from "../select-token/select-token-modal";
import { Token } from "@/constants/token";

interface SelectTokenDropdownProps {
  token?: Token;
  onTokenSelect: (token: Token) => void;
}

const SelectTokenDropdown = ({
  token,
  onTokenSelect,
}: SelectTokenDropdownProps) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="p-1 pr-2 rounded-full hover:bg-gray-100 w-full"
        onClick={() => setIsTokenModalOpen(true)}
      >
        {token ? (
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center gap-2">
              <Image
                src={token.image}
                alt={token.name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="font-medium">{token.symbol}</span>
            </div>
            <ChevronDown className="h-12 w-12 shrink-0" strokeWidth={2} />
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 w-full">
            <span className="font-medium">Select Token</span>
            <ChevronDown className="h-12 w-12 shrink-0" strokeWidth={2} />
          </div>
        )}
      </Button>

      {isTokenModalOpen && (
        <SelectTokenModal
          isOpen={isTokenModalOpen}
          onOpenModal={setIsTokenModalOpen}
          onConfirm={onTokenSelect}
        />
      )}
    </div>
  );
};

export default SelectTokenDropdown;
