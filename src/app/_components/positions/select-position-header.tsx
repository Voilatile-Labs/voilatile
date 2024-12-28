"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGlobalStore from "@/stores/global/global-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sortOptions = [
  { value: "createdAt", label: "Creation Date" },
  { value: "expiryDate", label: "Expiry Date" },
  { value: "fundingFee", label: "Funding Fee" },
] as const;

const SelectPositionHeader = () => {
  const { positionType, setPositionType, sortBy, setSortBy } = useGlobalStore();

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        value={positionType}
        onValueChange={(value) =>
          setPositionType(value as "long" | "short" | "liquidity")
        }
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="long" className="text-xs rounded-lg">
            Long
          </TabsTrigger>
          <TabsTrigger value="short" className="text-xs rounded-lg">
            Short
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="text-xs rounded-lg">
            Liquidity
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-4 justify-end">
        <label className="text-xs text-gray-400">Sort by:</label>
        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as "createdAt" | "expiryDate" | "fundingFee")
          }
        >
          <SelectTrigger className="w-[140px] rounded-xl text-xs">
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
      </div>
    </div>
  );
};

export default SelectPositionHeader;
