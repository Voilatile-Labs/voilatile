"use client";

import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useGlobalStore from "@/stores/global/global-store";
import { formatePercentage } from "@/utils/number";

const SelectFeeTier = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { fee, setFee } = useGlobalStore();

  const feeTiers = [
    { fee: 500, description: "Low funding fee" },
    { fee: 3000, description: "Medium funding fee" },
    { fee: 10000, description: "High funding fee" },
  ];

  const selectedFeeTier =
    feeTiers.find((tier) => tier.fee === fee) || feeTiers[0];

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">
        Select Daily Funding Fee{" "}
        <span className="text-gray-400">(% of position size)</span>
      </h3>

      <div className="border rounded-2xl p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">
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
            className="flex items-center gap-1 text-xs"
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
          {feeTiers.map((tier) => (
            <div
              key={tier.fee}
              onClick={() => {
                if (selectedFeeTier.fee === tier.fee) {
                  setFee(tier.fee);
                }
              }}
              className={`relative flex justify-between items-center p-3 border rounded-2xl hover:bg-gray-50 cursor-pointer ${
                selectedFeeTier.fee === tier.fee ? "bg-gray-50" : " opacity-60"
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
