"use client";

import { Button } from "@/components/ui/button";
import SelectPosition from "./select-position";
import useGlobalStore from "@/stores/global/global-store";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { calculateTokenTick } from "@/utils/currency";
import { priceToTick, tickToPrice } from "../open-position/select-strike-price";
import { formatNumberWithDecimals } from "@/utils/number";

const PositionSelector = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const {
    setStep,
    setLongToken,
    setShortToken,
    shortToken,
    longToken,
    tokenPriceMap,
    setTick,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
    longTokenAmount,
    shortTokenAmount,
  } = useGlobalStore();

  console.log({ longTokenAmount, shortTokenAmount, tick });

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

            if (tokenPriceMap && longToken && shortToken) {
              const value = calculateTokenTick(
                tokenPriceMap,
                longToken,
                shortToken
              );
              setTick(value);
            }
          }}
          onAmountChange={(value) => {
            if (longToken) {
              setLongTokenAmount(value);

              const amount = Number(value) / tickToPrice(tick);
              setShortTokenAmount(
                formatNumberWithDecimals(amount, 6).toString()
              );
            }
          }}
        />

        <SelectPosition
          label="Short"
          type="short"
          onTokenSelect={(token) => {
            if (longToken?.contractAddress === token.contractAddress) {
              setLongToken(null);
            }
            setShortToken(token);

            if (tokenPriceMap && longToken && shortToken) {
              const value = calculateTokenTick(
                tokenPriceMap,
                longToken,
                shortToken
              );
              setTick(value);
            }
          }}
          onAmountChange={(value) => {
            if (shortToken) {
              setShortTokenAmount(value);

              if (longToken && longTokenAmount) {
                const longTokenPrice = tokenPriceMap[longToken.searchId] || 1;
                const shortTokenPrice = tokenPriceMap[shortToken.searchId] || 1;

                const PAmount = Number(longTokenAmount) * shortTokenPrice;
                const QAmount = Number(value) * longTokenPrice;

                const price = PAmount / QAmount;

                const tick = priceToTick(price);
                setTick(tick);
              }
            }
          }}
        />
      </div>

      {address ? (
        <Button
          onClick={() => setStep("open-position")}
          className="rounded-2xl w-full mt-4 h-12 text-base"
        >
          Get trading
        </Button>
      ) : (
        <Button
          onClick={openConnectModal}
          className="rounded-2xl w-full mt-4 h-12 text-base"
        >
          Connect
        </Button>
      )}
    </div>
  );
};

export default PositionSelector;
