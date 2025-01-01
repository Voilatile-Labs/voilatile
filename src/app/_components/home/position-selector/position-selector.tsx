"use client";

import { Button } from "@/components/ui/button";
import SelectPosition from "./select-position";
import useGlobalStore from "@/stores/global/global-store";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useState } from "react";
import { decimalToTokenAmount, tokenAmountToDecimal } from "@/utils/currency";
import { toast } from "@/hooks/use-toast";

const PositionSelector = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    setStep,
    setLongToken,
    setShortToken,
    longToken,
    shortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
  } = useGlobalStore();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <SelectPosition
          label="Long"
          type="long"
          onTokenSelect={(token) => {
            if (shortToken?.contractAddress === token.contractAddress) {
              setShortToken(null);
            }
            setLongToken(token);
          }}
          onAmountChange={async (amount, rawAmount) => {
            if (!shortToken) {
              toast({
                title: "Token Required",
                description: "Please select a deposit token first",
              });
              return;
            }

            setLongTokenAmount({ amount, rawAmount });

            if (!amount) {
              setShortTokenAmount({ amount: "", rawAmount: 0 });
              return;
            }

            setIsLoading(true);
            try {
              const prices = await getCalculatedLongPrices([tick]);

              if (prices) {
                const shortRawAmount = rawAmount * prices[0];

                setShortTokenAmount({
                  amount: tokenAmountToDecimal(
                    parseInt(shortRawAmount.toString()),
                    shortToken?.decimals
                  ).toString(),
                  rawAmount: decimalToTokenAmount(
                    shortRawAmount,
                    shortToken?.decimals
                  ),
                });
              }
            } catch (error) {
              console.error("Failed:", error);
            } finally {
              setIsLoading(false);
            }
          }}
        />

        <SelectPosition
          label="Short"
          type="short"
          readOnly={true}
          isLoading={isLoading}
          onTokenSelect={(token) => {
            if (longToken?.contractAddress === token.contractAddress) {
              setLongToken(null);
            }
            setShortToken(token);
          }}
        />
      </div>

      <Button
        onClick={() => setStep("open-position")}
        className="rounded-2xl w-full mt-4 h-12 text-base"
      >
        Get trading
      </Button>
    </div>
  );
};

export default PositionSelector;
