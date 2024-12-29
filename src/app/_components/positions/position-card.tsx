"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Token } from "@/constants/token";
import Image from "next/image";
import { tokenAmountToDecimal } from "@/utils/currency";
import { formatePercentage } from "@/utils/number";

interface PositionCardProps {
  longToken: Token;
  shortToken: Token;
  feeTier: number;
  position: {
    tick: number;
    amount: bigint;
    startBlockNumber?: bigint;
    endBlockNumber?: bigint;
    payout?: bigint;
  };
}

const PositionCard = ({
  longToken,
  shortToken,
  feeTier,
  position,
}: PositionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
              position.amount,
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
                  position.amount,
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
                    position.payout,
                    shortToken.decimals
                  ).toFixed(2)}`}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {shortToken.symbol}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PositionCard;
