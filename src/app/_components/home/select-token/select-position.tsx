"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import SelectTokenModal from "./select-token-modal";
import Image from "next/image";
import { Token } from "@/constants/token";
import clsx from "clsx";
import { decimalToTokenAmount } from "@/utils/currency";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import useGlobalStore from "@/stores/global/global-store";

interface SelectPositionProps {
  label?: string;

  token?: Token;
  amount?: {
    amount: string;
    rawAmount: number;
  };

  allowTokenChange?: boolean;
  readOnly?: boolean;

  isLoading?: boolean;

  onTokenSelect?: (token: Token) => void;
  onAmountChange?: (amount: string, rawAmount: number) => void;
}

const SelectPosition = ({
  label,
  token,
  amount = {
    amount: "",
    rawAmount: 0,
  },
  allowTokenChange = true,
  readOnly = false,
  isLoading = false,
  onTokenSelect,
  onAmountChange,
}: SelectPositionProps) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const { tokenPriceMap } = useGlobalStore();

  const handleAmountChange = (amount: string) => {
    if (!token) {
      toast({
        title: "Token Required",
        description: "Please select a token first.",
      });
      return;
    }

    const regex = /^[0-9]*\.?[0-9]*$/;
    if (amount === "" || regex.test(amount)) {
      const rawAmount = decimalToTokenAmount(
        parseFloat(amount || "0"),
        token.decimals
      );
      onAmountChange?.(amount, rawAmount);
    }
  };

  const tokenAmountUsd = useMemo(() => {
    if (!token || !amount.amount) {
      return 0;
    }

    return tokenPriceMap[token.searchId] * parseFloat(amount.amount);
  }, [token, amount, tokenPriceMap]);

  return (
    <div className="max-w-lg w-full">
      <div
        className={clsx(
          "flex justify-between items-center border rounded-2xl p-4 bg-[#F7F2FF]",
          readOnly ? "bg-[#e2d1fc]/70" : ""
        )}
      >
        <div className="flex-1">
          {label && (
            <h3 className="text-sm mb-3 font-medium text-gray-900">{label}</h3>
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
                  "text-4xl p-0 font-medium border-0 bg-transparent text-gray-900",
                  "animate-pulse opacity-50"
                )}
                style={{ fontSize: "2.25rem" }}
                value={amount.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                readOnly={true}
              />
            </motion.div>
          ) : (
            <Input
              placeholder="0"
              className="text-4xl p-0 font-medium border-0 bg-transparent text-gray-900"
              style={{ fontSize: "2.25rem" }}
              value={amount.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              readOnly={readOnly}
            />
          )}

          <div className="mt-3 text-gray-500">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tokenAmountUsd)}
          </div>
        </div>

        <Button
          variant="outline"
          className="p-1 pr-2 rounded-full hover:bg-primary/10"
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
              <span className="font-medium mr-2 text-gray-900">
                {token.symbol}
              </span>
              {allowTokenChange && (
                <ChevronDown className="h-12 w-12 shrink-0" strokeWidth={2} />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2">
              <span className="font-medium text-gray-900">Select Token</span>
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
