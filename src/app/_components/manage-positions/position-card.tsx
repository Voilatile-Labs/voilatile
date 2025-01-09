"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Token } from "@/constants/token";
import Image from "next/image";
import { formatePercentage, formatNumberWithDecimals } from "@/utils/number";
import { useAccount } from "wagmi";
import { VoilatilePeripheryABI } from "@/constants/abi/voilatile_periphery";
import TransactionModal from "../home/open-position/transaction-modal";
import { Button } from "@/components/ui/button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { usePeripheryContract } from "@/app/_hooks/usePeripheryContract";
import { data as FeeTiers } from "@/constants/fee";
import { PositionData } from "@/app/_hooks/usePositionPeripheryContract";
import { Position } from "@/stores/global/global-store";
import { format, fromUnixTime } from "date-fns";
import clsx from "clsx";

interface PositionCardProps {
  longToken: Token;
  shortToken: Token;
  position: PositionData;
}

const PositionCard = ({
  longToken,
  shortToken,
  position,
}: PositionCardProps) => {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [isExpanded, setIsExpanded] = useState(false);

  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  const { feeTier } = usePeripheryContract(
    process.env.NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as string
  );

  const selectedFeeTier = useMemo(() => {
    return FeeTiers.find((tier) => tier.fee === feeTier) || FeeTiers[1];
  }, [feeTier]);

  const createExtendPositionTransaction = () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "extend",
        args: [`0x${position.id.toString(16).padStart(64, "0")}`],
      },
      title: "Extend Position",
      description: "Are you sure you want to extend this position?",
    });
    setOpenTransactionModal(true);
  };

  const createSellPositionTransaction = () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "sell",
        args: [position.id],
      },
      title: "Close Position",
      description: "Are you sure you want to close this position?",
    });
    setOpenTransactionModal(true);
  };

  const createSSClosePositionTransaction = () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "ssClose",
        args: [position.tickIndex],
      },
      title: "Close Short Position",
      description: "Are you sure you want to close this short position?",
    });
    setOpenTransactionModal(true);
  };

  const createLPClosePositionTransaction = () => {
    setTransactionData({
      contract: {
        address: process.env
          .NEXT_PUBLIC_VOILATILE_CONTRACT_ADDRESS as `0x${string}`,
        abi: VoilatilePeripheryABI,
        functionName: "LPclose",
        args: [position.tickIndex],
      },
      title: "Close LP Position",
      description: "Are you sure you want to close this LP position?",
    });
    setOpenTransactionModal(true);
  };

  return (
    <div
      className={clsx(
        "border rounded-xl shadow-xs hover:shadow transition-shadow p-4 bg-[#F7F2FF]",
        position.expired && "border-red-200 border-2"
      )}
    >
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
          className="p-2 hover:bg-primary/5 rounded-full transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2">
        <div className="text-center bg-primary/5 rounded-xl py-3">
          <p className="text-xs text-gray-500">Amount</p>
          <p className="font-medium text-gray-900">
            {`${formatNumberWithDecimals(
              Number(position.pTokenAmount.amount),
              6
            )} ${longToken.symbol}`}
          </p>
        </div>
        <div className="text-center bg-primary/5 rounded-xl py-3">
          <p className="text-xs text-gray-500">Fee Rate</p>
          <p className="font-medium text-gray-900">
            {formatePercentage(selectedFeeTier.fee / 10000)}
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
                {`${formatNumberWithDecimals(
                  Number(position.pTokenAmount.amount),
                  6
                )}`}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {longToken.symbol}
              </span>
            </div>
          </div>

          {position.startTimestamp && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Start Block Number</span>
              <span className="text-sm font-medium text-gray-900">
                {format(fromUnixTime(position.startTimestamp), "PPpp")}
              </span>
            </div>
          )}

          {position.endTimestamp && (
            <div className="flex justify-between items-center ">
              <span className="text-xs text-gray-500">End Block Number</span>
              <span className="text-sm font-medium text-gray-900">
                {format(fromUnixTime(position.endTimestamp), "PPpp")}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Funding Fee</span>
            <span className="text-sm font-medium text-gray-900">
              {formatePercentage(selectedFeeTier.fee / 10000)}
            </span>
          </div>

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
                {`${formatNumberWithDecimals(
                  Number(position.qTokensAmount.amount),
                  6
                )}`}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {shortToken.symbol}
              </span>
            </div>
          </div>

          {address ? (
            <>
              {position.type === Position.Long && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={createExtendPositionTransaction}
                    variant="outline"
                    className="flex-1"
                    disabled={position.expired}
                  >
                    Extend
                  </Button>
                  <Button
                    onClick={createSellPositionTransaction}
                    variant="destructive"
                    className="flex-1"
                    disabled={position.expired}
                  >
                    Close
                  </Button>
                </div>
              )}

              {position.type === Position.Short && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={createSSClosePositionTransaction}
                    variant="destructive"
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}

              {position.type === Position.Liquidity && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={createLPClosePositionTransaction}
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

export default PositionCard;
