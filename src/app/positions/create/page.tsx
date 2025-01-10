"use client";

import Page from "../../_components/common/page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGlobalStore, { Position } from "@/stores/global/global-store";
import OpenLiquidityPosition from "@/app/_components/create-positions/liquidity";
import OpenShortPosition from "@/app/_components/create-positions/short";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CreatePositionProps {}

const CreatePosition = ({}: CreatePositionProps) => {
  const { createPosition, setCreatePosition } = useGlobalStore();

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          <Tabs
            value={createPosition}
            onValueChange={(value) => setCreatePosition(value as Position)}
            className="w-full mb-4"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-white border-2 border-[#9747ff]">
              <TabsTrigger
                value={Position.Liquidity}
                className={cn(
                  "text-xs rounded-xl",
                  createPosition === Position.Liquidity &&
                    "data-[state=active]:bg-[#efe3ff]"
                )}
              >
                Liquidity
              </TabsTrigger>
              <TabsTrigger
                value={Position.Short}
                className={cn(
                  "text-xs rounded-xl",
                  createPosition === Position.Short &&
                    "data-[state=active]:bg-[#efe3ff]"
                )}
              >
                Short
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {createPosition === Position.Liquidity && <OpenLiquidityPosition />}

          {createPosition === Position.Short && <OpenShortPosition />}
        </div>
      </div>
    </Page>
  );
};

export default CreatePosition;
