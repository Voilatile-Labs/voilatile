"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PositionCardProps {
  pair: string;
  price: number;
  funding: number;
  quantity: number;
  createDate: Date;
  endDate: Date;
  fundingFee: number;
  payout: number;
}

const PositionCard = ({
  pair,
  price,
  funding,
  quantity,
  createDate,
  endDate,
  fundingFee,
  payout,
}: PositionCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-2xl p-4 hover:bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          <h3 className="font-medium">
            {pair} @ ${price.toLocaleString()}, {funding}% funding
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setShowDetails(true)}
          >
            Details
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pl-8">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Create Date</span>
              <span className="font-medium">
                {createDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">End Date</span>
              <span className="font-medium">
                {endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Funding Fee</span>
              <span className="font-medium">
                ${fundingFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payout</span>
              <span className="font-medium">${payout.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent
          className={cn("sm:max-w-[425px] rounded-2xl sm:rounded-2xl p-6")}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Position Details
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Create Date</span>
              <span className="font-medium">
                {createDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">End Date</span>
              <span className="font-medium">
                {endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Funding Fee</span>
              <span className="font-medium">
                ${fundingFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payout</span>
              <span className="font-medium">${payout.toLocaleString()}</span>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1 rounded-xl">
                Extend Position
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl">
                Close Position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PositionCard;
