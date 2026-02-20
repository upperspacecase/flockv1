"use client";

import { motion } from "framer-motion";

export default function BreathingLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="text-4xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🕊️
      </motion.div>
      <p className="text-sm text-[#e8ddd1]/40 tracking-wider">Loading...</p>
    </div>
  );
}
