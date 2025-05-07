"use client";

import React, { useState } from "react";
import { AtSignIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id="about-us"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-3xl  p-6 flex flex-col items-start gap-4 border border-[#9747ff] bg-white"
    >
      <motion.div className="flex items-center gap-2 bg-[#efe3ff] rounded-full px-4 py-2">
        <motion.span
          animate={
            hovered ? { width: 0, opacity: 0 } : { width: 16, opacity: 1 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <AtSignIcon className="w-4 h-4 text-blue-500" strokeWidth={3} />
        </motion.span>
        <span className="text-blue-500 font-semibold text-sm">About us</span>
        <motion.span
          animate={
            hovered ? { width: 16, opacity: 1 } : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <ArrowRight className="w-4 h-4 text-blue-500" strokeWidth={3} />
        </motion.span>
      </motion.div>

      <div className="text-blue-500 text-2xl font-semibold">
        Learn more about who we are and our mission to revolutionize
        decentralized finance.
      </div>
    </div>
  );
};

export default AboutUs;
