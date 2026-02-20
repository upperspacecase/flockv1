"use client";

import { motion } from "framer-motion";

export default function BreathingLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="text-4xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🕊️
      </motion.div>
      <p className="text-sm text-[#999] tracking-wider">Loading...</p>
    </div>
  );
}
