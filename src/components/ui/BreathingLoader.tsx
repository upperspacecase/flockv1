"use client";

import { motion } from "framer-motion";

export default function BreathingLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-3 h-3 rounded-full bg-[#1a1a1a]"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <p className="text-sm text-[#999] tracking-wider">Loading...</p>
    </div>
  );
}
