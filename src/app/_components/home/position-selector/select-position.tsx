"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SelectTokenModal from "./select-token-modal";
import useGlobalStore from "@/stores/global/global-store";
import Image from "next/image";
import { Token } from "@/constants/token";
import clsx from "clsx";
import { decimalToTokenAmount } from "@/utils/currency";
import { motion } from "framer-motion";

interface SelectPositionProps {
  type: "long" | "short";

  label?: string;
  amountLabel?: string;

  allowTokenChange?: boolean;
  readOnly?: boolean;
  isLoading?: boolean;

  onTokenSelect: (token: Token) => void;
  onAmountChange?: (amount: string, rawAmount: number) => void;
}

const SelectPosition = ({
  type,
  label,
  amountLabel,
  allowTokenChange = true,
  readOnly = false,
  isLoading = false,
  onTokenSelect,
  onAmountChange,
}: SelectPositionProps) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const { longToken, shortToken, longTokenAmount, shortTokenAmount } =
    useGlobalStore();

  const handleAmountChange = (amount: string, token: Token) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (amount === "" || regex.test(amount)) {
      const rawAmount = decimalToTokenAmount(
        parseFloat(amount || "0"),
        token.decimals
      );
      onAmountChange?.(amount, rawAmount);
    }
  };

  const token = type === "long" ? longToken : shortToken;
  const amount =
    type === "long" ? longTokenAmount.amount : shortTokenAmount.amount;

  return (
    <div className="max-w-lg w-full">
      <div
        className={clsx(
          "flex justify-between items-center border rounded-2xl p-4",
          readOnly ? "bg-gray-50" : ""
        )}
      >
        <div className="flex-1">
          {label && (
            <h3 className="text-sm text-gray-500 mb-3 font-medium">{label}</h3>
          )}
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Input
                placeholder="0"
                className={clsx(
                  "text-4xl p-0 font-medium border-0 bg-transparent placeholder:text-gray-300",
                  "animate-pulse opacity-50"
                )}
                style={{ fontSize: "2.25rem" }}
                value={amount}
                onChange={(e) =>
                  handleAmountChange(e.target.value, token as Token)
                }
                readOnly={true}
              />
            </motion.div>
          ) : (
            <Input
              placeholder="0"
              className="text-4xl p-0 font-medium border-0 bg-transparent placeholder:text-gray-300"
              style={{ fontSize: "2.25rem" }}
              value={amount}
              onChange={(e) =>
                handleAmountChange(e.target.value, token as Token)
              }
              readOnly={readOnly}
            />
          )}

          <div className="mt-3 text-gray-500">
            {amountLabel && <span className="mr-2">{amountLabel}</span>}
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
          onConfirm={onTokenSelect}
        />
      )}
    </div>
  );
};

export default SelectPosition;
