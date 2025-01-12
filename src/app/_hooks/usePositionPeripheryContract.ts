import { useReadContracts } from "wagmi";
import { readContracts } from "@wagmi/core";
import { useEffect, useMemo, useState } from "react";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { config } from "@/app/_containers/wallet-provider";
import { toast } from "@/hooks/use-toast";
import { Position } from "@/stores/global/global-store";
import { data as Tokens } from "@/constants/token";
import { tokenAmountToDecimal } from "@/utils/currency";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export interface PositionData {
  id: number;
  type: Position;
  tickIndex: number;
  startTimestamp?: number;
  endTimestamp?: number;
  expired?: boolean;
  pTokenAmount: {
    amount: string;
    rawAmount: number;
  };
  qTokensAmount: {
    amount: string;
    rawAmount: number;
  };
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL as string),
});

export const usePositionPeripheryContract = (
  address: string,
  contract: string
) => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tokens } = useReadContracts({
    contracts: [
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "principalToken",
      },
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "quoteToken",
      },
    ],
  });

  const { pToken, qToken } = useMemo(() => {
    if (!tokens) {
      return { pToken: undefined, qToken: undefined };
    }

    const pToken = Tokens.find((x) => x.contractAddress === tokens[0].result);
    const qToken = Tokens.find((x) => x.contractAddress === tokens[1].result);

    return {
      pToken,
      qToken,
    };
  }, [tokens]);

  const { data: nextPositionIds } = useReadContracts({
    contracts: [
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextBuyPositionId",
        args: [address],
      },
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextLPPositionId",
        args: [address],
      },
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextSSPositionId",
        args: [address],
      },
    ],
  });

  useEffect(() => {
    const getPositions = async () => {
      if (!address || !nextPositionIds || !pToken || !qToken) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [
          nextLongPositionId,
          nextLiquidityPositionId,
          nextShortPositionId,
        ] = nextPositionIds.map((id) => Number(id?.result || 0));

        const longPositionContractOptions = Array.from(
          { length: nextLongPositionId },
          (_, i) => ({
            address: contract as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchBuyPosition",
            args: [address, i],
          })
        );

        const liquidityPositionContractOptions = Array.from(
          { length: nextLiquidityPositionId },
          (_, i) => ({
            address: contract as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchLPPosition",
            args: [address, i],
          })
        );

        const shortPositionContractOptions = Array.from(
          { length: nextShortPositionId },
          (_, i) => ({
            address: contract as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchSSPosition",
            args: [address, i],
          })
        );

        const rawPositions = await readContracts(config, {
          // @ts-expect-error Contract type mismatch with readContracts
          contracts: [
            ...longPositionContractOptions,
            ...liquidityPositionContractOptions,
            ...shortPositionContractOptions,
          ],
        });

        console.log(rawPositions);

        if (!rawPositions) {
          toast({
            title: "Error Fetching Positions",
            description: "Unable to retrieve position data.",
          });
          setIsLoading(false);
          return;
        }

        const result: PositionData[] = [];
        for (const index in rawPositions) {
          const rawPosition = rawPositions[index].result as any;
          if (Number(index) < Number(nextLongPositionId)) {
            const block = await publicClient.getBlockNumber();
            const startBlock = await publicClient.getBlock({
              blockNumber: BigInt(rawPosition[1]),
            });
            const startBlockTimestamp = Number(startBlock.timestamp);

            let endBlockTimestamp = 0;
            let expired = false;
            if (block < BigInt(rawPosition[2])) {
              const currentBlock = await publicClient.getBlock({
                blockNumber: block,
              });
              endBlockTimestamp =
                Number(currentBlock.timestamp) +
                12 * Number(BigInt(rawPosition[2]) - block);
              expired = false;
            } else {
              const endBlock = await publicClient.getBlock({
                blockNumber: BigInt(rawPosition[2]),
              });
              endBlockTimestamp = Number(endBlock.timestamp);
              expired = true;
            }

            result.push({
              id: Number(index),
              type: Position.Long,
              tickIndex: Number(rawPosition[0]),
              startTimestamp: startBlockTimestamp,
              endTimestamp: endBlockTimestamp,
              expired,
              pTokenAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[3] || 0),
                  pToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[3] || 0),
              },
              qTokensAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[4] || 0),
                  qToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[4] || 0),
              },
            });
          } else if (
            Number(index) <
            Number(nextLongPositionId) + Number(nextLiquidityPositionId)
          ) {
            result.push({
              id: Number(index),
              type: Position.Liquidity,
              tickIndex: Number(rawPosition[0]),
              pTokenAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[1] || 0),
                  pToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[1] || 0),
              },
              qTokensAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[2] || 0),
                  qToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[2] || 0),
              },
            });
          } else {
            result.push({
              id: Number(index),
              type: Position.Short,
              tickIndex: Number(rawPosition[0]),
              pTokenAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[1] || 0),
                  pToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[1] || 0),
              },
              qTokensAmount: {
                amount: tokenAmountToDecimal(
                  Number(rawPosition[2] || 0),
                  qToken.decimals
                ).toString(),
                rawAmount: Number(rawPosition[2] || 0),
              },
            });
          }
        }

        setPositions(result);
      } catch (error) {
        toast({
          title: "Error Fetching Positions",
          description: "Unable to retrieve position data.",
        });
        console.log("Failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPositions();
  }, [address, contract, nextPositionIds, pToken, qToken]);

  return {
    positions,
    pToken,
    qToken,
    isLoading,
  };
};
