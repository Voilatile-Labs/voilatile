"use client";

import Page from "./_components/common/page";
import useGlobalStore from "@/stores/global/global-store";
import PositionSelector from "./_components/home/position-selector/position-selector";
import OpenPosition from "./_components/home/open-position/open-position";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

const Home = ({}: HomeProps) => {
  const { step } = useGlobalStore();

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          {step === "select-token" && <PositionSelector />}

          {step === "open-position" && <OpenPosition />}
        </div>
      </div>
    </Page>
  );
};

export default Home;
