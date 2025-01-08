"use client";

import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useEffect, useMemo, useState } from "react";

import { toast } from "@/hooks/use-toast";

import useLiquidityPositionStore, {
  initialState,
} from "@/stores/global/liquidity-position-store";
import SelectTokenPair from "./select-token-pair";
import SelectPosition from "../../home/select-token/select-position";
import SelectFeeTier from "../../home/open-position/select-fee-tier";
import TransactionModal from "../../home/open-position/transaction-modal";
import SelectStrikePriceRange from "./select-strike-price-range";
import {
  TICK_SPACE,
  tickToPrice,
  tokenAmountToDecimal,
} from "@/utils/currency";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { erc20Abi } from "viem";
import { Token } from "@/constants/token";
import { useRouter } from "next/navigation";

const OpenLiquidityPosition = () => {
  const router = useRouter();

  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [updateAllowance, setUpdateAllowance] = useState("");

  const { atm } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    longToken,
    shortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    longTokenAmount,
    shortTokenAmount,
    reset,
    fee,
    setFee,
    startTick,
    endTick,
  } = useLiquidityPositionStore();

  const { data: longTokenAllowance, refetch: refetchLongTokenAllowance } =
    useReadContract({
      address: longToken?.contractAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "allowance",
      args: address
        ? [
            address,
            process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
          ]
        : undefined,
    });

  const hasLongTokenAllowance = useMemo(() => {
    if (!longTokenAllowance || longTokenAmount.rawAmount < 0) {
      return false;
    }
    return longTokenAllowance >= longTokenAmount.rawAmount;
  }, [longTokenAllowance, longTokenAmount.rawAmount]);

  const { data: shortTokenAllowance, refetch: refetchShortTokenAllowance } =
    useReadContract({
      address: shortToken?.contractAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "allowance",
      args: address
        ? [
            address,
            process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
          ]
        : undefined,
    });

  const hasShortTokenAllowance = useMemo(() => {
    if (!shortTokenAllowance || shortTokenAmount.rawAmount < 0) {
      return false;
    }
    return shortTokenAllowance >= shortTokenAmount.rawAmount;
  }, [shortTokenAllowance, shortTokenAmount.rawAmount]);

  useEffect(() => {
    if (updateAllowance) {
      refetchLongTokenAllowance();
      refetchShortTokenAllowance();
    }
  }, [updateAllowance, refetchLongTokenAllowance, refetchShortTokenAllowance]);

  const createAllowanceTransaction = (token: Token | undefined) => {
    if (!longToken) {
      toast({
        title: "Token Required",
        description: "Please select a long token first",
      });
      return;
    }

    if (!shortToken) {
      toast({
        title: "Token Required",
        description: "Please select a short token first",
      });
      return;
    }

    if (!token) {
      return;
    }

    return {
      contract: {
        address: token.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [
          process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
          BigInt(
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          ),
        ],
      },
      title: "Approve Token",
      description: `Allow Voilatile to spend your ${token.symbol}.`,
      type: "approve",
    };
  };

  const createPositionTransaction = () => {
    if (!longToken || !shortToken || !startTick || !endTick) {
      toast({
        title: "Token Required",
        description: "Please select a token first",
      });
      return;
    }

    if (!startTick || !endTick) {
      toast({
        title: "Price Range Required",
        description: "Please select a price range for your liquidity position",
      });
      return;
    }

    if (!longTokenAmount.rawAmount) {
      toast({
        title: "Amount Required",
        description: "Please enter the amount you want to trade",
      });
      return;
    }

    return {
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "rangeLP",
        args: [longTokenAmount.rawAmount, startTick, endTick],
      },
      title: "Open Liquidity Position",
      description: "Are you sure you want to open this liquidity position?",
      type: "position",
    };
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <h2 className="text-lg font-semibold">Open Liquidity Position</h2>
        </div>

        <SelectTokenPair />

        <SelectFeeTier fee={fee} onFeeSelect={setFee} />

        <SelectStrikePriceRange />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Deposit Amount</h3>

          <SelectPosition
            token={longToken}
            amount={longTokenAmount}
            allowTokenChange={false}
            onAmountChange={async (amount, rawAmount) => {
              if (!shortToken) {
                toast({
                  title: "Token Required",
                  description: "Please select a short token first",
                });
                return;
              }

              setLongTokenAmount({ amount, rawAmount });

              if (!amount) {
                setShortTokenAmount({ amount: "", rawAmount: 0 });
                return;
              }

              if (!atm) {
                return;
              }

              try {
                const upperTicks =
                  Math.floor((endTick - atm) / TICK_SPACE) + 1 > 0
                    ? Array.from(
                        {
                          length: Math.floor((endTick - atm) / TICK_SPACE) + 1,
                        },
                        (_, i) => atm + i * TICK_SPACE
                      )
                    : [];

                const lowerTicks =
                  Math.floor((atm - startTick) / TICK_SPACE) > 0
                    ? Array.from(
                        { length: Math.floor((atm - startTick) / TICK_SPACE) },
                        (_, i) => atm - (i + 1) * TICK_SPACE
                      )
                    : [];

                if (upperTicks.length === 0) {
                  throw new Error("Invalid Range");
                }

                const shortTokenRawAmount = Math.floor(
                  (rawAmount / upperTicks.length) *
                    lowerTicks.reduce((acc, t) => acc + tickToPrice(t), 0)
                );

                setShortTokenAmount({
                  amount: tokenAmountToDecimal(
                    shortTokenRawAmount,
                    shortToken.decimals
                  ).toString(),
                  rawAmount: shortTokenRawAmount,
                });
              } catch (error) {
                toast({
                  title: "Invalid Range",
                  description: "Please select a valid price range.",
                });
                console.log("Failed:", error);
              }
            }}
          />
        </div>

        <div className="w-full">
          <SelectPosition
            token={shortToken}
            amount={shortTokenAmount}
            allowTokenChange={false}
            onAmountChange={async (amount, rawAmount) => {
              if (!longToken) {
                toast({
                  title: "Token Required",
                  description: "Please select a long token first",
                });
                return;
              }

              setShortTokenAmount({ amount, rawAmount });

              if (!amount) {
                setLongTokenAmount({ amount: "", rawAmount: 0 });
                return;
              }

              if (!atm) {
                return;
              }

              try {
                const upperTicks =
                  Math.floor((endTick - atm) / TICK_SPACE) + 1 > 0
                    ? Array.from(
                        {
                          length: Math.floor((endTick - atm) / TICK_SPACE) + 1,
                        },
                        (_, i) => atm + i * TICK_SPACE
                      )
                    : [];

                const lowerTicks =
                  Math.floor((atm - startTick) / TICK_SPACE) > 0
                    ? Array.from(
                        { length: Math.floor((atm - startTick) / TICK_SPACE) },
                        (_, i) => atm - (i + 1) * TICK_SPACE
                      )
                    : [];

                if (lowerTicks.length === 0) {
                  throw new Error("Invalid Range");
                }

                const longTokenRawAmount = Math.floor(
                  (rawAmount * upperTicks.length) /
                    lowerTicks.reduce((acc, t) => acc + tickToPrice(t), 0)
                );

                setLongTokenAmount({
                  amount: tokenAmountToDecimal(
                    longTokenRawAmount,
                    longToken.decimals
                  ).toString(),
                  rawAmount: longTokenRawAmount,
                });
              } catch (error) {
                toast({
                  title: "Invalid Range",
                  description: "Please select a valid price range.",
                });
                console.log("Failed:", error);
              }
            }}
          />
        </div>
      </div>

      {address ? (
        hasLongTokenAllowance && hasShortTokenAllowance ? (
          <Button
            onClick={() => {
              const transaction = createPositionTransaction();
              if (transaction) {
                setTransactionData(transaction);
                setOpenTransactionModal(true);
              }
            }}
            className="rounded-2xl w-full mt-4 h-12 text-base"
          >
            Open Position
          </Button>
        ) : (
          <Button
            onClick={() => {
              const token = !hasLongTokenAllowance ? longToken : shortToken;
              const transaction = createAllowanceTransaction(token);

              if (transaction) {
                setTransactionData(transaction);
                setOpenTransactionModal(true);
              }
            }}
            className="rounded-2xl w-full mt-4 h-12 text-base"
          >
            {!hasLongTokenAllowance
              ? `Approve ${longToken?.symbol}`
              : `Approve ${shortToken?.symbol}`}
          </Button>
        )
      ) : (
        <Button
          onClick={openConnectModal}
          className="rounded-2xl w-full mt-4 h-12 text-base"
        >
          Connect
        </Button>
      )}

      {transactionData && (
        <TransactionModal
          isOpen={openTransactionModal}
          onSuccess={(data, hash) => {
            if (data.type === "approve") {
              setUpdateAllowance(hash);
            }

            setTransactionData(null);
            setOpenTransactionModal(false);

            if (data.type === "position") {
              reset(initialState);
              router.push("/positions");
            }
          }}
          onClose={() => {
            setTransactionData(null);
            setOpenTransactionModal(false);
          }}
          data={transactionData}
        />
      )}
    </div>
  );
};

export default OpenLiquidityPosition;
