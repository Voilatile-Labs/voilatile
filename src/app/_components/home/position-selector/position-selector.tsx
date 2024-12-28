"use client";

import { Button } from "@/components/ui/button";
import SelectPosition from "./select-position";
import useGlobalStore from "@/stores/global/global-store";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const PositionSelector = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const { setStep } = useGlobalStore();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <SelectPosition label="Long" type="long" />
        <SelectPosition label="Short" type="short" />
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
