"use client";

import Page from "../_components/common/page";
import { useState } from "react";
import PositionCard from "../_components/positions/position-card";
import SelectPositionHeader from "../_components/positions/select-position-header";
import useGlobalStore from "@/stores/global/global-store";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PositionsProps {}

type Position = {
  id: string;
  type: "Long" | "Short" | "Liquidity";
  tokenA: string;
  tokenB: string;
  createdAt: Date;
  expiryDate: Date;
  fundingFee: number;
};

const Positions = ({}: PositionsProps) => {
  const { sortBy } = useGlobalStore();

  const [positions] = useState<Position[]>([
    {
      id: "1",
      type: "Long",
      tokenA: "ETH",
      tokenB: "USDC",
      createdAt: new Date("2024-01-01"),
      expiryDate: new Date("2024-02-01"),
      fundingFee: 100,
    },
  ]);

  const sortedPositions = [...positions].sort((a, b) => {
    switch (sortBy) {
      case "createdAt":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "expiryDate":
        return a.expiryDate.getTime() - b.expiryDate.getTime();
      case "fundingFee":
        return b.fundingFee - a.fundingFee;
      default:
        return 0;
    }
  });

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          <SelectPositionHeader />

          <div className="flex flex-col justify-center items-center">
            <div className="max-w-lg w-full">
              <div className="space-y-4 mt-4">
                {sortedPositions.map((position) => (
                  <PositionCard
                    key={position.id}
                    pair={`${position.tokenA}/${position.tokenB}`}
                    price={0} // You'll need to add price to your Position type
                    funding={position.fundingFee}
                    quantity={0} // You'll need to add quantity to your Position type
                    createDate={position.createdAt}
                    endDate={position.expiryDate}
                    fundingFee={position.fundingFee}
                    payout={0} // You'll need to add payout to your Position type
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Positions;
