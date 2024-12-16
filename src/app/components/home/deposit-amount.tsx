"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Bitcoin } from "lucide-react";

const DepositAmount = () => {
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Deposit Amounts</h3>

      <div className="space-y-4">
        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="relative">
            <Input
              type="number"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="w-full pr-28 text-2xl font-medium border-0 bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.00"
            />
            <div className="absolute right-0 top-0">
              <div className="flex items-center gap-1 border rounded-full px-2 py-1 bg-white">
                <Bitcoin className="h-4 w-4" />
                <span className="text-sm font-medium">Token 1</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2 ml-2">
            ≈ ${amount1 ? `${parseFloat(amount1).toLocaleString()}` : "0.00"}
          </div>
        </div>

        <div className="border rounded-xl p-3 bg-gray-50">
          <div className="relative">
            <Input
              type="number"
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
              className="w-full rounded-xl pr-28 font-medium border-0 bg-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="0.00"
            />
            <div className="absolute right-0 top-0">
              <div className="flex items-center gap-1 border rounded-full px-2 py-1 bg-white">
                <Bitcoin className="h-4 w-4" />
                <span className="text-sm font-medium">Token 2</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2 ml-2">
            ≈ ${amount2 ? `${parseFloat(amount2).toLocaleString()}` : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositAmount;
