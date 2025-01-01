"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Token } from "@/constants/token";
import Image from "next/image";
import { tokenAmountToDecimal } from "@/utils/currency";
import { formatePercentage } from "@/utils/number";
import { useAccount } from "wagmi";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import TransactionModal from "./transaction-modal";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface PositionCardProps {
  longToken: Token;
  shortToken: Token;
  feeTier: number;
  position: {
    type: string;
    tick: number;
    amount: bigint;
    startBlockNumber?: bigint;
    endBlockNumber?: bigint;
    payout?: bigint;
    positionId: number;
  };
}

const PositionCard = ({
  longToken,
  shortToken,
  feeTier,
  position,
}: PositionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const extend = async () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "extend",
        args: [position.positionId],
      },
      title: "Extend Position",
      description: "Are you sure you want to extend this position?",
    });
    setOpenTransactionModal(true);
  };

  const sell = async () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "sell",
        args: [position.positionId],
      },
      title: "Close Position",
      description: "Are you sure you want to close this position?",
    });
    setOpenTransactionModal(true);
  };

  const ssClose = async () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "ssClose",
        args: [position.tick],
      },
      title: "Close Short Position",
      description: "Are you sure you want to close this short position?",
    });
    setOpenTransactionModal(true);
  };

  const lpClose = async () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "LPclose",
        args: [position.tick],
      },
      title: "Close LP Position",
      description: "Are you sure you want to close this LP position?",
    });
    setOpenTransactionModal(true);
  };

  return (
    <div className="border rounded-xl shadow-sm hover:shadow transition-shadow p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <Image
              src={longToken.image}
              alt={longToken.symbol}
              width={32}
              height={32}
              className="rounded-full border-2 border-white"
            />
            <Image
              src={shortToken.image}
              alt={shortToken.symbol}
              width={32}
              height={32}
              className="rounded-full border-2 border-white"
            />
          </div>

          <h3 className="font-medium text-gray-900">
            {longToken.symbol}
            <span className="text-gray-400">/</span>
            {shortToken.symbol}
          </h3>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2">
        <div className="text-center bg-gray-50 rounded-xl py-3">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-medium text-gray-900">
            {`${tokenAmountToDecimal(
              Number(position.amount),
              longToken.decimals
            ).toFixed(2)} ${longToken.symbol}`}
          </p>
        </div>
        <div className="text-center bg-gray-50 rounded-xl py-3">
          <p className="text-xs text-gray-500">Fee Rate</p>
          <p className="font-medium text-gray-900">
            {formatePercentage(feeTier / 10000)}
          </p>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Quantity</span>
            <div className="flex items-center gap-1">
              <Image
                src={longToken.image}
                alt={longToken.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-gray-900">
                {`${tokenAmountToDecimal(
                  Number(position.amount),
                  longToken.decimals
                ).toFixed(2)}`}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {longToken.symbol}
              </span>
            </div>
          </div>
          {position.startBlockNumber && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Start Block Number</span>
              <span className="text-sm font-medium text-gray-900">
                {position.startBlockNumber.toString()}
              </span>
            </div>
          )}
          {position.endBlockNumber && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">End Block Number</span>
              <span className="text-sm font-medium text-gray-900">
                {position.endBlockNumber.toString()}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Funding Fee</span>
            <span className="text-sm font-medium text-gray-900">
              {formatePercentage(feeTier / 10000)}
            </span>
          </div>
          {position.payout && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Payout</span>
              <div className="flex items-center gap-1">
                <Image
                  src={shortToken.image}
                  alt={shortToken.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  {`${tokenAmountToDecimal(
                    Number(position.payout),
                    shortToken.decimals
                  ).toFixed(2)}`}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {shortToken.symbol}
                </span>
              </div>
            </div>
          )}

          {address ? (
            <>
              {position.type === "long" && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={extend} variant="outline" className="flex-1">
                    Extend
                  </Button>
                  <Button
                    onClick={sell}
                    variant="destructive"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}

              {position.type === "short" && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={ssClose}
                    variant="destructive"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}

              {position.type === "liquidity" && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={lpClose}
                    variant="destructive"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Button
              onClick={openConnectModal}
              className="rounded-xl w-full mt-4 h-12 text-base"
            >
              Connect
            </Button>
          )}
        </div>
      )}

      <TransactionModal
        isOpen={openTransactionModal}
        onSuccess={() => {
          setOpenTransactionModal(false);
        }}
        onClose={() => setOpenTransactionModal(false)}
        data={transactionData}
      />
    </div>
  );
};

export default PositionCard;
