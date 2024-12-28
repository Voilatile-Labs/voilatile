"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useGlobalStore from "@/stores/global/global-store";
import SelectTokenPair from "./select-token-pair";
import SelectFeeTier from "./select-fee-tier";
import { useAccount } from "wagmi";
import SelectPosition from "../position-selector/select-position";
import SelectStrikePrice from "./select-strike-price";

const OpenPosition = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const { setStep } = useGlobalStore();

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
          />
        </div>

        <SelectFeeTier />

        <SelectStrikePrice />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Deposit Amount</h3>
          <SelectPosition type="short" allowTokenChange={false} />
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
