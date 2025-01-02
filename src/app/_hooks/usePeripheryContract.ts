import { useReadContracts } from "wagmi";
import { readContracts } from "@wagmi/core";
import { useMemo } from "react";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { config } from "@/app/_containers/wallet-provider";
import { toast } from "@/hooks/use-toast";
import { tickToPrice } from "@/utils/currency";

export const usePeripheryContract = (contract: string) => {
  const { data } = useReadContracts({
    contracts: [
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "feeTier",
      },
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
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "fetchATM",
      },
    ],
  });

  const { feeTier, pToken, qToken, atm } = useMemo(() => {
    return {
      feeTier: data?.[0]?.result ? Number(data[0].result) : undefined,
      pToken: data?.[1]?.result ? String(data[1].result) : undefined,
      qToken: data?.[2]?.result ? String(data[2].result) : undefined,
      atm: data?.[3]?.result ? Number(data[3].result) : undefined,
    };
  }, [data]);

  const getCalculatedLongPrices = async (tickIndexes: number[]) => {
    if (!atm) return [];

    const atmTickPrice = tickToPrice(atm);

    return tickIndexes.map((x) => {
      const zero = Math.max(0, atmTickPrice - tickToPrice(x));
      const premium =
        (atmTickPrice / 50) *
        100 **
          -Math.abs(
            5.4 *
              ((atmTickPrice * tickToPrice(x - atm) - atmTickPrice) /
                atmTickPrice)
          );
      return zero + premium;
    });
  };

  const getContractLongPrices = async (tickIndexes: number[]) => {
    if (!atm) return [];

    try {
      const contracts = tickIndexes.map((tickIndex) => ({
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "fetchLongPrice",
        args: [BigInt(tickIndex.toString())],
      }));

      const results = await readContracts(config, {
        contracts,
      });

      return results.map((result) => result.result && Number(result.result));
    } catch (error) {
      toast({
        title: "Error Fetching Prices",
        description: "Unable to retrieve the long position prices.",
      });
      console.error("Failed:", error);
      return;
    }
  };

  return {
    feeTier,
    pToken,
    qToken,
    atm,
    getCalculatedLongPrices,
    getContractLongPrices,
  };
};
