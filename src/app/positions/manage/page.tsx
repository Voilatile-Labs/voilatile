"use client";

import { useAccount } from "wagmi";
import SelectPositionHeader from "../../_components/manage-positions/select-position-header";
import Page from "../../_components/common/page";
import { usePositionPeripheryContract } from "../../_hooks/usePositionPeripheryContract";
import useGlobalStore from "@/stores/global/global-store";
import { useMemo } from "react";
import PositionCard from "../../_components/manage-positions/position-card";
import { Token } from "@/constants/token";
import { Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PositionsProps {}

const Positions = ({}: PositionsProps) => {
  const { address } = useAccount();

  const { managePosition } = useGlobalStore();

  const { positions, isLoading, pToken, qToken } = usePositionPeripheryContract(
    address as string,
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const data = useMemo(() => {
    if (!positions) {
      return [];
    }
    return positions.filter((p) => p.type === managePosition).reverse();
  }, [positions, managePosition]);

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          <SelectPositionHeader />

          {isLoading ? (
            <div className="flex justify-center items-center mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-4 p-8 border rounded-xl bg-primary/5">
              <p className="text-lg font-medium text-gray-900">
                No positions found
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Create a new position to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {data.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  longToken={pToken as Token}
                  shortToken={qToken as Token}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Positions;
