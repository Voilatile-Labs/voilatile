"use client";

import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const SelectFeeTier = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTier, setSelectedTier] = useState("5");

  const feeTiers = [
    { percentage: "1", description: "Low funding fee" },
    { percentage: "5", description: "Medium funding fee" },
    { percentage: "15", description: "High funding fee" },
  ];

  return (
    <div className="w-full">
      <div className="border rounded-xl p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium">
              {selectedTier}% funding fee
            </div>
            <div className="text-xs text-gray-500">% you pay in funding</div>
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
              key={tier.percentage}
              onClick={() => setSelectedTier(tier.percentage)}
              className={`relative flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer ${
                selectedTier === tier.percentage ? "bg-gray-50" : ""
              }`}
            >
              {selectedTier === tier.percentage && (
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
                <div className="text-sm font-medium">{tier.percentage}%</div>
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
