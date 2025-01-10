"use client";

import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatePercentage } from "@/utils/number";
import { data as FeeTiers } from "@/constants/fee";

interface SelectFeeTierProps {
  fee: number;
  onFeeSelect: (fee: number) => void;
}

const SelectFeeTier = ({ fee, onFeeSelect }: SelectFeeTierProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedFeeTier =
    FeeTiers.find((tier) => tier.fee === fee) || FeeTiers[1];

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">
        Select Daily Funding Fee{" "}
        <span className="text-gray-400">(% of position size)</span>
      </h3>

      <div className="border rounded-2xl p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {formatePercentage(selectedFeeTier.fee / 10000)} funding fee
            </div>
            <div className="text-xs text-gray-500">
              {selectedFeeTier.description}
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs bg-[#efe3ff] hover:bg-[#e2d1fc]"
          >
            {isExpanded ? "Less" : "More"}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {FeeTiers.map((tier) => (
            <div
              key={tier.fee}
              onClick={() => {
                if (tier.disabled) {
                  return;
                }
                onFeeSelect(tier.fee);
              }}
              className={`relative flex justify-between items-center p-3 border rounded-2xl text-gray-900 hover:text-gray-700 cursor-pointer ${
                tier.disabled
                  ? "text-gray-400 hover:text-gray-400 opacity-50"
                  : ""
              }`}
            >
              {selectedFeeTier.fee === tier.fee && (
                <div className="absolute top-2 right-2">
                  <div className="bg-black rounded-full h-4 w-4 flex items-center justify-center">
                    <Check
                      className="h-[10px] w-[10px] text-white"
                      strokeWidth={3}
                    />
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium">
                  {formatePercentage(tier.fee / 10000)}
                </div>
                <div className="text-xs text-gray-500">{tier.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectFeeTier;
