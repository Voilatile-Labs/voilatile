import { useReadContracts } from "wagmi";
import { readContracts } from "@wagmi/core";
import { useEffect, useState } from "react";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { config } from "@/app/_containers/wallet-provider";

interface PositionData {
  positionId: number;
  type: "long" | "short" | "liquidity";
  tickIndex: number;
  amount: bigint;
  entryBlockNumber?: bigint;
  expirationBlockNumber?: bigint;
  qTokensEarned?: bigint;
}

export const usePositions = (address: string, contractAddress: string) => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: nextPositions } = useReadContracts({
    contracts: [
      {
        address: contractAddress as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextBuyPositionId",
      },
      {
        address: contractAddress as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextSSPositionId",
      },
      {
        address: contractAddress as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "nextLPPositionId",
      },
    ],
  });

  useEffect(() => {
    const getPositions = async () => {
      if (!address || !nextPositions) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const [nextLongId, nextShortId, nextLiquidityId] = nextPositions.map(
          (id) => Number(id?.result || 0)
        );

        const longPositionCalls = Array.from(
          { length: nextLongId },
          (_, i) => ({
            address: contractAddress as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchBuyPosition",
            args: [address, i],
          })
        );

        const shortPositionCalls = Array.from(
          { length: nextShortId },
          (_, i) => ({
            address: contractAddress as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchSSPosition",
            args: [i],
          })
        );

        const liquidityPositionCalls = Array.from(
          { length: nextLiquidityId },
          (_, i) => ({
            address: contractAddress as `0x${string}`,
            abi: VoilatilePeripheryABI,
            functionName: "fetchLPPosition",
            args: [i],
          })
        );

        const allPositions = await readContracts(config, {
          contracts: [
            ...longPositionCalls,
            ...shortPositionCalls,
            ...liquidityPositionCalls,
          ],
        });

        if (!allPositions) {
          throw new Error("Failed to fetch positions");
        }

        const longPositions = allPositions
          .slice(0, nextLongId)
          .map((data, index) => {
            const item = data.result as any;
            if (!item || !item[3]) return null;
            return {
              positionId: index,
              type: "long" as const,
              tickIndex: Number(item[0] || 0),
              entryBlockNumber: BigInt(item[1] || 0),
              expirationBlockNumber: BigInt(item[2] || 0),
              amount: BigInt(item[3] || 0),
              qTokensEarned: BigInt(item[4] || 0),
            };
          })
          .filter(
            (item): item is NonNullable<typeof item> =>
              item !== null && item.amount > 0
          );

        const shortPositions = allPositions
          .slice(nextLongId, nextLongId + nextShortId)
          .map((data, index) => {
            const item = data.result as any;
            if (!item || !item[1]) return null;
            return {
              positionId: index,
              type: "short" as const,
              tickIndex: Number(item[0] || 0),
              amount: BigInt(item[1] || 0),
            };
          })
          .filter(
            (item): item is NonNullable<typeof item> =>
              item !== null && item.amount > 0
          );

        const liquidityPositions = allPositions
          .slice(nextLongId + nextShortId)
          .map((data, index) => {
            const item = data.result as any;
            if (!item || !item[1]) return null;
            return {
              positionId: index,
              type: "liquidity" as const,
              tickIndex: Number(item[0] || 0),
              amount: BigInt(item[1] || 0),
            };
          })
          .filter(
            (item): item is NonNullable<typeof item> =>
              item !== null && item.amount > 0
          );

        setPositions([
          ...longPositions,
          ...shortPositions,
          ...liquidityPositions,
        ]);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch positions")
        );
      } finally {
        setIsLoading(false);
      }
    };

    getPositions();
  }, [address, nextPositions, contractAddress]);

  return {
    positions,
    isLoading,
    error,
  };
};
