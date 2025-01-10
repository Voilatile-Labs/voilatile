"use client";

import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContract } from "wagmi";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";

import SelectPosition from "../../home/select-token/select-position";
import TransactionModal from "../../home/open-position/transaction-modal";
import useShortPositionStore, {
  initialState,
} from "@/stores/global/short-position-store";
import SelectFeeTier from "../../home/open-position/select-fee-tier";
import SelectTokenPair from "./select-token-pair";
import SelectStrikePrice from "./select-strike-price";
import { erc20Abi } from "viem";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { tokenAmountToDecimal } from "@/utils/currency";
import { tickToPrice } from "@/utils/currency";
import { defaultShortToken } from "@/constants/token";
import { useRouter } from "next/navigation";

const OpenShortPosition = () => {
  const router = useRouter();

  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [updateAllowance, setUpdateAllowance] = useState("");

  const { atm } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    longToken,
    shortToken,
    setShortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
    longTokenAmount,
    shortTokenAmount,
    reset,
    fee,
    setFee,
  } = useShortPositionStore();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
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

  const hasAllowance = useMemo(() => {
    if (!allowance || shortTokenAmount.rawAmount < 0) {
      return false;
    }
    return allowance >= shortTokenAmount.rawAmount;
  }, [allowance, shortTokenAmount.rawAmount]);

  useEffect(() => {
    if (updateAllowance) {
      refetchAllowance();
    }
  }, [updateAllowance, refetchAllowance]);

  const createAllowanceTransaction = () => {
    if (!longToken || !shortToken) {
      toast({
        title: "Token Required",
        description: "Please select a token first",
      });
      return;
    }

    return {
      contract: {
        address: shortToken.contractAddress as `0x${string}`,
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
      description: `Allow Voilatile to spend your ${shortToken.symbol}.`,
      type: "approve",
    };
  };

  const createPositionTransaction = () => {
    if (!longToken || !shortToken) {
      toast({
        title: "Token Required",
        description: "Please select a token first",
      });
      return;
    }

    if (!tick) {
      toast({
        title: "Strike Price Required",
        description: "Please select a strike price for your position",
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
        functionName: "ss",
        args: [tick, longTokenAmount.rawAmount],
      },
      title: "Open Short Position",
      description: "Are you sure you want to open this short position?",
      type: "position",
    };
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <h2 className="text-lg font-semibold">Open Short Position</h2>
        </div>

        <SelectTokenPair />

        <SelectPosition
          token={longToken}
          amount={longTokenAmount}
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

            try {
              setIsLoading(true);

              if (!atm || !tick) {
                return;
              }

              if (tick >= atm) {
                setShortToken(longToken);
                setShortTokenAmount({
                  amount: amount,
                  rawAmount: rawAmount,
                });
              } else {
                setShortToken(defaultShortToken);
                const shortTokenRawAmount = Math.floor(
                  rawAmount * tickToPrice(tick)
                );

                setShortTokenAmount({
                  amount: tokenAmountToDecimal(
                    shortTokenRawAmount,
                    shortToken.decimals
                  ).toString(),
                  rawAmount: shortTokenRawAmount,
                });
              }
            } catch (error) {
              toast({
                title: "Calculation Error",
                description: "Failed to calculate token amount.",
              });
              console.log("Failed:", error);
            } finally {
              setIsLoading(false);
            }
          }}
        />

        <SelectFeeTier fee={fee} onFeeSelect={setFee} />

        <SelectStrikePrice />

        <div className="w-full">
          <SelectPosition
            token={shortToken}
            amount={shortTokenAmount}
            allowTokenChange={false}
            readOnly={true}
            isLoading={isLoading}
          />
        </div>
      </div>

      {address ? (
        hasAllowance ? (
          <Button
            onClick={() => {
              const transaction = createPositionTransaction();

              if (transaction) {
                setTransactionData(transaction);
                setOpenTransactionModal(true);
              }
            }}
            className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] border border-[#e2d1fc] text-gray-900"
          >
            Open
          </Button>
        ) : (
          <Button
            onClick={() => {
              const transaction = createAllowanceTransaction();

              if (transaction) {
                setTransactionData(transaction);
                setOpenTransactionModal(true);
              }
            }}
            className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] border border-[#e2d1fc] text-gray-900"
          >
            Approve
          </Button>
        )
      ) : (
        <Button
          onClick={openConnectModal}
          className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] border border-[#e2d1fc] text-gray-900"
        >
          Connect Wallet
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

export default OpenShortPosition;
