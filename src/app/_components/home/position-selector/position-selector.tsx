"use client";

import { Button } from "@/components/ui/button";
import SelectPosition from "./select-position";
import useGlobalStore from "@/stores/global/global-store";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useState } from "react";
import { tokenAmountToDecimal } from "@/utils/currency";

const PositionSelector = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    setStep,
    setLongToken,
    setShortToken,
    shortToken,
    longToken,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
  } = useGlobalStore();

  const { getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

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
            if (!longToken) return;

            setLongTokenAmount({ amount, rawAmount });

            if (!amount) {
              setShortTokenAmount({ amount: "", rawAmount: 0 });
              return;
            }

            setIsLoading(true);
            try {
              const prices = await getCalculatedLongPrices([tick]);
              console.log({ prices });

              if (prices) {
                const scaledPrice = prices[0] / 2 ** 64;
                const shortRawAmount = scaledPrice * rawAmount;

                setShortTokenAmount({
                  amount: tokenAmountToDecimal(
                    shortRawAmount,
                    shortToken?.decimals
                  ).toString(),
                  rawAmount: shortRawAmount,
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
