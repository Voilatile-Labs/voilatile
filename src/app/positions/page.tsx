"use client";

import Page from "../_components/common/page";
import PositionCard from "../_components/positions/position-card";
import SelectPositionHeader from "../_components/positions/select-position-header";
import useGlobalStore from "@/stores/global/global-store";
// import { usePositions } from "@/hooks/usePositions";
// import { useAccount } from "wagmi";
import { data as Tokens } from "@/constants/token";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PositionsProps {}

const Positions = ({}: PositionsProps) => {
  // const { address } = useAccount();

  // const { positionType } = useGlobalStore();

  // const { positions, principalToken, quoteToken } = usePositions(
  //   address as string,
  //   process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  // );

  // const data = useMemo(() => {
  //   return positions.filter((p) => p.type === positionType);
  // }, [positions, positionType]);

  // const longToken = useMemo(() => {
  //   return Tokens.find(
  //     (t) => t.contractAddress.toLowerCase() === principalToken?.toLowerCase()
  //   );
  // }, [principalToken]);

  // const shortToken = useMemo(() => {
  //   return Tokens.find(
  //     (t) => t.contractAddress.toLowerCase() === quoteToken?.toLowerCase()
  //   );
  // }, [quoteToken]);

  const testFeeTier = 10000;
  const testLongToken = Tokens[0];
  const testShortToken = Tokens[1];
  const testData = [
    {
      positionId: 1,
      entryBlockNumber: BigInt(100),
      expirationBlockNumber: BigInt(200),
      type: "long",
      tickIndex: 1000,
      amount: BigInt("1000000000000000000"),
      qTokensEarned: BigInt("1000000000000000000"),
    },
    {
      positionId: 2,
      type: "short",
      tickIndex: 2000,
      amount: BigInt("2000000000000000000"),
    },
    {
      positionId: 3,
      type: "liquidity",
      tickIndex: 3000,
      amount: BigInt("3000000000000000000"),
    },
  ];

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          {/* <SelectPositionHeader />

          <div className="space-y-4 mt-4">
            {testData
              .filter((p) => p.type === positionType)
              .map((position) => (
                <PositionCard
                  key={position.positionId}
                  longToken={testLongToken}
                  shortToken={testShortToken}
                  feeTier={testFeeTier}
                  position={{
                    type: position.type,
                    tick: position.tickIndex,
                    amount: position.amount,
                    startBlockNumber: position.entryBlockNumber,
                    endBlockNumber: position.expirationBlockNumber,
                    payout: position.qTokensEarned,
                    positionId: position.positionId,
                  }}
                />
              ))}
          </div> */}
        </div>
      </div>
    </Page>
  );
};

export default Positions;
