"use client";

import React, { useState } from "react";
import { PhoneIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ScheduleCall = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id="schedule-call"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-3xl bg-pink-100 p-6 flex flex-col items-start gap-4"
    >
      <motion.div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
        <motion.span
          animate={
            hovered ? { width: 0, opacity: 0 } : { width: 16, opacity: 1 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <PhoneIcon className="w-4 h-4 text-pink-500" strokeWidth={3} />
        </motion.span>
        <span className="text-pink-500 font-semibold text-sm">
          Schedule a call
        </span>
        <motion.span
          animate={
            hovered ? { width: 16, opacity: 1 } : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <ArrowRight className="w-4 h-4 text-pink-500" strokeWidth={3} />
        </motion.span>
      </motion.div>

      <div className="text-pink-500 text-2xl font-semibold">
        Schedule a call with us to learn more about our platform.
      </div>
    </div>
  );
};

export default ScheduleCall;
