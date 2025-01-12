import { useReadContracts } from "wagmi";
import { readContracts } from "@wagmi/core";
import { useMemo } from "react";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { config } from "@/app/_containers/wallet-provider";
import { toast } from "@/hooks/use-toast";
import { tickToPrice } from "@/utils/currency";
import { data as Tokens } from "@/constants/token";

export const usePeripheryContract = (contract: string) => {
  const { data: peripheryData } = useReadContracts({
    contracts: [
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "feeTier",
      },
      {
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "fetchATM",
      },
    ],
  });

  const { feeTier, atm } = useMemo(() => {
    return {
      feeTier: peripheryData?.[0]?.result
        ? Number(peripheryData[0].result)
        : undefined,
      atm: peripheryData?.[1]?.result
        ? Number(peripheryData[1].result)
        : undefined,
    };
  }, [peripheryData]);

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
        abi: VoilatilePeripheryABI as any,
        functionName: "fetchLongPrice",
        args: [tickIndex],
      }));

      const results = await readContracts(config, {
        contracts,
      });

      return results.map((result) => {
        if (result.result) {
          return Number(result.result);
        }
        return null;
      });
    } catch (error) {
      toast({
        title: "Error Fetching Prices",
        description: "Unable to retrieve the long position prices.",
      });
      console.log("Failed:", error);
      return;
    }
  };

  const getContractUtilization = async (tickIndexes: number[]) => {
    if (!atm) return [];

    try {
      const contracts = tickIndexes.map((tickIndex) => ({
        address: contract as `0x${string}`,
        abi: VoilatilePeripheryABI as any,
        functionName: "fetchUtilization",
        args: [tickIndex],
      }));

      const results = await readContracts(config, {
        contracts,
      });

      return results.map((result) => {
        if (result.result) {
          const [numerator, denominator] = result.result as [bigint, bigint];
          return {
            numerator: Number(numerator),
            denominator: Number(denominator),
            utilization: Number(numerator) / (Number(denominator) || 1),
          };
        }
        return null;
      });
    } catch (error) {
      toast({
        title: "Error Fetching Utilization",
        description: "Unable to retrieve the utilization rates.",
      });
      console.log("Failed:", error);
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
    getContractUtilization,
  };
};
