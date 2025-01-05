"use client";

import Page from "./_components/common/page";
import SelectToken from "./_components/home/select-token";
import OpenPosition from "./_components/home/open-position";
import useLongPositionStore, {
  CreateLongPosition,
} from "@/stores/global/long-position-store";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

const Home = ({}: HomeProps) => {
  const { step } = useLongPositionStore();

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full">
          {step === CreateLongPosition.SelectToken && <SelectToken />}

          {step === CreateLongPosition.OpenPosition && <OpenPosition />}
        </div>
      </div>
    </Page>
  );
};

export default Home;
