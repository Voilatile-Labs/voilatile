"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useGlobalStore from "@/stores/global/global-store";
import SelectTokenPair from "./select-token-pair";
import SelectFeeTier from "./select-fee-tier";
import { useAccount } from "wagmi";
import SelectPosition from "../position-selector/select-position";
import SelectStrikePrice, {
  priceToTick,
  tickToPrice,
} from "./select-strike-price";
import { calculateTokenTick } from "@/utils/currency";
import { formatNumberWithDecimals } from "@/utils/number";

const OpenPosition = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const {
    setStep,
    longToken,
    shortToken,
    tokenPriceMap,
    setLongToken,
    setShortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    setTick,
    tick,
    longTokenAmount,
  } = useGlobalStore();

  return (
    <div className="w-full">
      <div className="rounded-xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("select-token")}
            className="h-8 w-8 absolute left-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Open Trade Position</h2>
        </div>

        <SelectTokenPair />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Enter Amount</h3>
          <SelectPosition
            type="long"
            allowTokenChange={false}
            usdLabel="Position size:"
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
        </div>

        <SelectFeeTier />

        <SelectStrikePrice />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Deposit Amount</h3>
          <SelectPosition
            type="short"
            allowTokenChange={false}
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
                  const shortTokenPrice =
                    tokenPriceMap[shortToken.searchId] || 1;

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
      </div>

      {address ? (
        <Button
          onClick={() => setStep("open-position")}
          className="rounded-2xl w-full mt-4 h-12 text-base"
        >
          Open
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

export default OpenPosition;
