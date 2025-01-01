"use client";

import { Button } from "@/components/ui/button";
import useGlobalStore from "@/stores/global/global-store";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import SelectTokenModal from "../position-selector/select-token-modal";

const SelectTokenPair = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [type, setType] = useState<"long" | "short">("long");

  const { longToken, setLongToken, shortToken, setShortToken } =
    useGlobalStore();

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select pair</h3>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="p-1 pr-2 rounded-full hover:bg-gray-100 w-full"
          onClick={() => {
            setType("long");
            setIsTokenModalOpen(true);
          }}
        >
          {longToken ? (
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-2">
                <Image
                  src={longToken.image}
                  alt={longToken.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="font-medium">{longToken.symbol}</span>
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

        <Button
          variant="outline"
          className="p-1 pr-2 rounded-full hover:bg-gray-100 w-full"
          onClick={() => {
            setType("short");
            setIsTokenModalOpen(true);
          }}
        >
          {shortToken ? (
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-2">
                <Image
                  src={shortToken.image}
                  alt={shortToken.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <span className="font-medium">{shortToken.symbol}</span>
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
      </div>

      {isTokenModalOpen && (
        <SelectTokenModal
          isOpen={isTokenModalOpen}
          onOpenModal={setIsTokenModalOpen}
          onConfirm={(token) => {
            if (type === "long") {
              if (shortToken?.contractAddress === token.contractAddress) {
                setShortToken(null);
              }
              setLongToken(token);
            } else {
              if (longToken?.contractAddress === token.contractAddress) {
                setLongToken(null);
              }
              setShortToken(token);
            }
          }}
        />
      )}
    </div>
  );
};

export default SelectTokenPair;
