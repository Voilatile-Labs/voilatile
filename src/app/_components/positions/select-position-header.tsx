"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGlobalStore, { Position } from "@/stores/global/global-store";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const sortOptions = [
//   { value: "createdAt", label: "Creation Date" },
//   { value: "expiryDate", label: "Expiry Date" },
//   { value: "fundingFee", label: "Funding Fee" },
// ] as const;

const SelectPositionHeader = () => {
  const { managePosition, setManagePosition } = useGlobalStore();

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        value={managePosition}
        onValueChange={(value) => setManagePosition(value as Position)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value={Position.Long} className="text-xs rounded-xl">
            Long
          </TabsTrigger>
          <TabsTrigger value={Position.Short} className="text-xs rounded-xl">
            Short
          </TabsTrigger>
          <TabsTrigger
            value={Position.Liquidity}
            className="text-xs rounded-xl"
          >
            Liquidity
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* <div className="flex items-center gap-4 justify-end">
        <label className="text-xs text-gray-400">Sort by:</label>
        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as "createdAt" | "expiryDate" | "fundingFee")
          }
        >
          <SelectTrigger className="w-[140px] rounded-2xl text-xs">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs focus:bg-transparent"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
    </div>
  );
};

export default SelectPositionHeader;
