"use client";

import React, { useState } from "react";
import { BookIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Documentation = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id="documentation"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-3xl bg-green-100 p-6 flex flex-col items-start gap-4 col-span-1 sm:col-span-2"
    >
      <motion.div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
        <motion.span
          animate={
            hovered ? { width: 0, opacity: 0 } : { width: 16, opacity: 1 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <BookIcon className="w-4 h-4 text-green-500" strokeWidth={3} />
        </motion.span>
        <span className="text-green-500 font-semibold text-sm">
          Documentation
        </span>
        <motion.span
          animate={
            hovered ? { width: 16, opacity: 1 } : { width: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center overflow-hidden"
        >
          <ArrowRight className="w-4 h-4 text-green-500" strokeWidth={3} />
        </motion.span>
      </motion.div>

      <div className="text-green-500 text-2xl font-semibold">
        Access our documentation to learn more about our platform.
      </div>
    </div>
  );
};

export default Documentation;
