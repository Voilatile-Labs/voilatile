"use client";

import Page from "./_components/common/page";
import SelectToken from "./_components/home/select-token";
import OpenPosition from "./_components/home/open-position";
import useLongPositionStore, {
  CreateLongPosition,
} from "@/stores/global/long-position-store";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AboutUs from "./_components/home/learn-more/about-us";
import ScheduleCall from "./_components/home/learn-more/schedule-call";
import Documentation from "./_components/home/learn-more/documentation";
import Footer from "./_components/common/footer";

const learnMoreAnimation = {
  animate: {
    y: [0, 6, 0],
    opacity: [0.7, 1, 0.7],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: [0.4, 0, 0.6, 1],
    times: [0, 0.5, 1],
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HomeProps {}

const Home = ({}: HomeProps) => {
  const { step } = useLongPositionStore();

  return (
    <Page>
      <div className="flex flex-col justify-center items-center p-4 py-8">
        <div className="max-w-lg w-full min-h-screen">
          {step === CreateLongPosition.SelectToken && <SelectToken />}

          {step === CreateLongPosition.OpenPosition && <OpenPosition />}
        </div>

        {step === CreateLongPosition.SelectToken && (
          <motion.div
            className="flex flex-col justify-center items-center absolute bottom-10"
            {...learnMoreAnimation}
          >
            <motion.p
              className="text-gray-500 font-medium text-sm"
              {...learnMoreAnimation}
            >
              Scroll to learn more
            </motion.p>
            <motion.div {...learnMoreAnimation}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </motion.div>
        )}

        {step === CreateLongPosition.SelectToken && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[1000px]">
            <AboutUs />

            <ScheduleCall />

            <Documentation />
          </div>
        )}
      </div>

      {step === CreateLongPosition.SelectToken && <Footer />}
    </Page>
  );
};

export default Home;
