"use client";

import Page from "../../_components/common/page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGlobalStore, { Position } from "@/stores/global/global-store";
import OpenLiquidityPosition from "@/app/_components/create-positions/liquidity";
import OpenShortPosition from "@/app/_components/create-positions/short";

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
            <TabsList className="grid w-full grid-cols-2 rounded-2xl">
              <TabsTrigger
                value={Position.Liquidity}
                className="text-xs rounded-xl"
              >
                Liquidity
              </TabsTrigger>
              <TabsTrigger
                value={Position.Short}
                className="text-xs rounded-xl"
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
