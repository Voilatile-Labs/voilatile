"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white border-2 border-[#9747ff]">
          <TabsTrigger
            value={Position.Long}
            className={cn(
              "text-xs rounded-xl",
              managePosition === Position.Long &&
                "data-[state=active]:bg-[#efe3ff]"
            )}
          >
            Long
          </TabsTrigger>
          <TabsTrigger
            value={Position.Short}
            className={cn(
              "text-xs rounded-xl",
              managePosition === Position.Short &&
                "data-[state=active]:bg-[#efe3ff]"
            )}
          >
            Short
          </TabsTrigger>
          <TabsTrigger
            value={Position.Liquidity}
            className={cn(
              "text-xs rounded-xl",
              managePosition === Position.Liquidity &&
                "data-[state=active]:bg-[#efe3ff]"
            )}
          >
            Liquidity
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SelectPositionHeader;
