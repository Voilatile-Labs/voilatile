"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import SelectTokenPair from "./select-token-pair";
import SelectFeeTier from "./select-fee-tier";
import { useAccount, useReadContract } from "wagmi";
import SelectPosition from "../select-token/select-position";
import { tokenAmountToDecimal } from "@/utils/currency";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useEffect, useMemo, useState } from "react";
import SelectStrikePrice from "./select-strike-price";
import TransactionModal from "./transaction-modal";
import { erc20Abi } from "viem";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { toast } from "@/hooks/use-toast";
import useLongPositionStore, {
  CreateLongPosition,
  initialState,
} from "@/stores/global/long-position-store";
import { useRouter } from "next/navigation";
import useGlobalStore, { Position } from "@/stores/global/global-store";

const OpenPosition = () => {
  const router = useRouter();

  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const { setManagePosition } = useGlobalStore();

  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [updateAllowance, setUpdateAllowance] = useState("");

  const { getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    setStep,
    longToken,
    shortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
    longTokenAmount,
    shortTokenAmount,
    reset,
    fee,
    setFee,
  } = useLongPositionStore();

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
        functionName: "buy",
        args: [tick, longTokenAmount.rawAmount],
      },
      title: "Open Position",
      description: "Are you sure you want to open this position?",
      type: "position",
    };
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep(CreateLongPosition.SelectToken)}
            className="h-8 w-8 absolute left-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Open Trade Position</h2>
        </div>

        <SelectTokenPair />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Enter Amount</h3>

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

              setIsLoading(true);
              try {
                const longPrices = await getCalculatedLongPrices([tick]);

                if (longPrices) {
                  const shortTokenRawAmount = Math.floor(
                    rawAmount * longPrices[0]
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
        </div>

        <SelectFeeTier fee={fee} onFeeSelect={setFee} />

        <SelectStrikePrice />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Deposit Amount</h3>
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
            className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] hover:bg-[#e2d1fc] text-gray-900"
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
            className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] hover:bg-[#e2d1fc] text-gray-900"
          >
            Approve
          </Button>
        )
      ) : (
        <Button
          onClick={openConnectModal}
          className="rounded-2xl w-full mt-4 h-12 text-base bg-[#efe3ff] hover:bg-[#e2d1fc] text-gray-900"
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
              reset({ ...initialState, step: CreateLongPosition.OpenPosition });

              setManagePosition(Position.Long);
              router.push("/positions/manage");
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

export default OpenPosition;
