"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectTokenPair = () => {
  return (
    <div className="w-full">
      <h3 className="text-xs font-medium mb-2">Select pair</h3>
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="btc">Token 1</SelectItem>
            <SelectItem value="eth">Token 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="btc">Token 1</SelectItem>
            <SelectItem value="eth">Token 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SelectTokenPair;
