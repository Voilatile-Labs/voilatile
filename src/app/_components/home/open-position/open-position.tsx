"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useGlobalStore from "@/stores/global/global-store";
import SelectTokenPair from "./select-token-pair";
import SelectFeeTier from "./select-fee-tier";
import { useAccount, useReadContract } from "wagmi";
import SelectPosition from "../position-selector/select-position";
import { decimalToTokenAmount, tokenAmountToDecimal } from "@/utils/currency";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { useMemo, useState } from "react";
import SelectStrikePrice from "./select-strike-price";
import TransactionModal from "../../positions/transaction-modal";
import { erc20Abi } from "viem";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import { toast } from "@/hooks/use-toast";

const OpenPosition = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { getCalculatedLongPrices } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const {
    setStep,
    setLongToken,
    setShortToken,
    longToken,
    shortToken,
    setLongTokenAmount,
    setShortTokenAmount,
    tick,
    longTokenAmount,
    shortTokenAmount,
  } = useGlobalStore();

  const { data: allowance } = useReadContract({
    address: shortToken?.contractAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args:
      address && shortToken
        ? [
            address,
            process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
          ]
        : undefined,
  });

  const hasAllowance = useMemo(() => {
    if (!allowance || !shortTokenAmount.rawAmount) {
      return false;
    }
    return allowance >= shortTokenAmount.rawAmount;
  }, [allowance, shortTokenAmount.rawAmount]);

  const createAllowanceTransaction = () => {
    if (!longToken || !shortToken) {
      toast({
        title: "Missing Tokens",
        description: "Please select both long and short tokens to continue",
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
    };
  };

  const createPositionTransaction = () => {
    if (!longToken || !shortToken) {
      toast({
        title: "Missing Tokens",
        description: "Please select both long and short tokens to continue",
      });
      return;
    }

    if (!tick) {
      toast({
        title: "Missing Strike Price",
        description: "Please select a strike price for your position",
      });
      return;
    }

    if (!longTokenAmount.rawAmount) {
      toast({
        title: "Missing Amount",
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
    };
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl bg-white shadow-sm p-4 max-w-lg w-full border flex flex-col gap-4">
        <div className="flex items-center justify-center gap-4 mb-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("select-token")}
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
            type="long"
            allowTokenChange={false}
            onTokenSelect={(token) => {
              if (shortToken?.contractAddress === token.contractAddress) {
                setShortToken(null);
              }
              setLongToken(token);
            }}
            onAmountChange={async (amount, rawAmount) => {
              if (!shortToken) {
                toast({
                  title: "Token Required",
                  description: "Please select a deposit token first",
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
                const prices = await getCalculatedLongPrices([tick]);

                if (prices) {
                  const shortRawAmount = rawAmount * prices[0];

                  setShortTokenAmount({
                    amount: tokenAmountToDecimal(
                      parseInt(shortRawAmount.toString()),
                      shortToken?.decimals
                    ).toString(),
                    rawAmount: decimalToTokenAmount(
                      shortRawAmount,
                      shortToken?.decimals
                    ),
                  });
                }
              } catch (error) {
                console.error("Failed:", error);
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>

        <SelectFeeTier />

        <SelectStrikePrice />

        <div className="w-full">
          <h3 className="text-xs font-medium mb-2">Deposit Amount</h3>
          <SelectPosition
            type="short"
            allowTokenChange={false}
            readOnly={true}
            isLoading={isLoading}
            onTokenSelect={(token) => {
              if (longToken?.contractAddress === token.contractAddress) {
                setLongToken(null);
              }
              setShortToken(token);
            }}
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
            className="rounded-2xl w-full mt-4 h-12 text-base"
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
            className="rounded-2xl w-full mt-4 h-12 text-base"
          >
            Approve
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
          onSuccess={() => {
            setTransactionData(null);
            setOpenTransactionModal(false);
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
