"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGlobalStore, { Position } from "@/stores/global/global-store";

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
    </div>
  );
};

export default SelectPositionHeader;
