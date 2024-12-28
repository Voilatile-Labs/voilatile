"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SelectTokenModal from "./select-token-modal";
import useGlobalStore from "@/stores/global/global-store";
import Image from "next/image";

interface SelectPositionProps {
  label?: string;
  type: "long" | "short";
  allowTokenChange?: boolean;
  usdLabel?: string;
}

const SelectPosition = ({
  label,
  type,
  allowTokenChange = true,
  usdLabel,
}: SelectPositionProps) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const {
    longToken,
    setLongToken,
    shortToken,
    setShortToken,
    longTokenAmount,
    setLongTokenAmount,
    shortTokenAmount,
    setShortTokenAmount,
  } = useGlobalStore();

  const onAmountChange = (value: string) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || regex.test(value)) {
      if (type === "long") {
        setLongTokenAmount(value);
      } else {
        setShortTokenAmount(value);
      }
    }
  };

  const token = type === "long" ? longToken : shortToken;
  const amount = type === "long" ? longTokenAmount : shortTokenAmount;

  return (
    <div className="max-w-lg w-full">
      <div className="flex justify-between items-center border rounded-2xl p-4">
        <div className="flex-1">
          {label && (
            <h3 className="text-sm text-gray-500 mb-3 font-medium">{label}</h3>
          )}
          <Input
            placeholder="0"
            className="text-4xl p-0 font-medium border-0 bg-transparent placeholder:text-gray-300"
            style={{ fontSize: "2.25rem" }}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
          />

          <div className="mt-3 text-gray-500">
            {usdLabel && <span className="mr-2">{usdLabel}</span>}
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(parseFloat(amount || "0"))}
          </div>
        </div>

        <Button
          variant="outline"
          className="p-1 pr-2 rounded-full hover:bg-gray-100"
          onClick={() => {
            if (allowTokenChange) {
              setIsTokenModalOpen(true);
            }
          }}
        >
          {token ? (
            <div className="flex items-center gap-2">
              <Image
                src={token.image}
                alt={token.name}
                width={28}
                height={28}
                className="rounded-full"
              />
              <span className="font-medium mr-2">{token.symbol}</span>
              {allowTokenChange && (
                <ChevronDown className="h-12 w-12 shrink-0" strokeWidth={2} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2">
              <span className="font-medium">Select Token</span>
              {allowTokenChange && (
                <ChevronDown className="h-12 w-12 shrink-0" strokeWidth={2} />
              )}
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

export default SelectPosition;
