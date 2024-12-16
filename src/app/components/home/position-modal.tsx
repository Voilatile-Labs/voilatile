"use client";

import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import SelectTokenPair from "./select-token-pair";
import SelectFeeTier from "./select-fee-tier";
import SelectStrikePrice from "./select-strike-price";
import DepositAmount from "./deposit-amount";
import { useConnectModal } from "@rainbow-me/rainbowkit";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PositionProps {}

const Position = ({}: PositionProps) => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="flex justify-center items-center w-full">
      <div className="rounded-xl bg-white shadow-sm p-4 max-w-lg w-full border my-8 flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("go back");
            }}
            className="h-8 w-8 absolute left-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Open Long Position</h2>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("open setting");
            }}
            className="h-8 w-8 absolute right-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <SelectTokenPair />

        <SelectFeeTier />

        <SelectStrikePrice />

        <DepositAmount />

        <Button className="w-full" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default Position;
