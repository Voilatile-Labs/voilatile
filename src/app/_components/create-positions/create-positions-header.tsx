"use client";

import useGlobalStore, { PositionOption } from "@/stores/global/global-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SelectPositionHeader = () => {
  const { createPosition, setCreatePosition } = useGlobalStore();

  return (
    <div className="flex flex-col gap-2">
      <Tabs
        value={createPosition}
        onValueChange={(value) => setCreatePosition(value as PositionOption)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger
            value={PositionOption.SHORT}
            className="text-xs rounded-lg"
          >
            Short
          </TabsTrigger>
          <TabsTrigger
            value={PositionOption.LIQUIDITY}
            className="text-xs rounded-lg"
          >
            Liquidity
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SelectPositionHeader;
