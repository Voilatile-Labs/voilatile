"use client";

import { Button } from "@/components/ui/button";
import SelectPosition from "./select-position";
import useLongPositionStore, {
  CreateLongPosition,
} from "@/stores/global/long-position-store";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useState } from "react";
import { tokenAmountToDecimal } from "@/utils/currency";
import { toast } from "@/hooks/use-toast";

const SelectToken = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    setStep,
    longToken,
    setLongToken,
    shortToken,
    setShortToken,
    longTokenAmount,
    setLongTokenAmount,
    shortTokenAmount,
    setShortTokenAmount,
    tick,
  } = useLongPositionStore();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <SelectPosition
          label="Long"
          token={longToken}
          amount={longTokenAmount}
          onTokenSelect={(token) => {
            if (longToken?.contractAddress === token.contractAddress) {
              return;
            }

            if (shortToken?.contractAddress === token.contractAddress) {
              setShortToken(undefined);
            }

            setLongTokenAmount({ amount: "", rawAmount: 0 });
            setShortTokenAmount({ amount: "", rawAmount: 0 });
            setLongToken(token);
          }}
          onAmountChange={async (amount, rawAmount) => {
            if (!shortToken) {
              toast({
                title: "Token Required",
                description: "Please select a short token first",
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
              const longPrices = await getCalculatedLongPrices([tick]);

              if (longPrices) {
                const shortTokenRawAmount = Math.floor(
                  rawAmount * longPrices[0]
                );

                setShortTokenAmount({
                  amount: tokenAmountToDecimal(
                    shortTokenRawAmount,
                    shortToken.decimals
                  ).toString(),
                  rawAmount: shortTokenRawAmount,
                });
              }
            } catch (error) {
              toast({
                title: "Calculation Error",
                description: "Failed to calculate token amount.",
              });
              console.log("Failed:", error);
            } finally {
              setIsLoading(false);
            }
          }}
        />

        <SelectPosition
          label="Short"
          token={shortToken}
          amount={shortTokenAmount}
          readOnly={true}
          isLoading={isLoading}
          onTokenSelect={(token) => {
            if (shortToken?.contractAddress === token.contractAddress) {
              return;
            }

            if (longToken?.contractAddress === token.contractAddress) {
              setLongToken(undefined);
            }

            setLongTokenAmount({ amount: "", rawAmount: 0 });
            setShortTokenAmount({ amount: "", rawAmount: 0 });
            setShortToken(token);
          }}
        />
      </div>

      <Button
        onClick={() => setStep(CreateLongPosition.OpenPosition)}
        className="rounded-2xl w-full mt-4 h-12 text-base"
      >
        Get trading
      </Button>
    </div>
  );
};

export default SelectToken;
