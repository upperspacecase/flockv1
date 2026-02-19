"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface MigrationLinesProps {
  count?: number;
  className?: string;
}

// Seeded pseudo-random generator for deterministic line generation
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function MigrationLines({
  count = 12,
  className = "",
}: MigrationLinesProps) {
  const lines = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }, (_, i) => {
      const y1 = rand() * 100;
      const y2 = rand() * 100;
      const delay = rand() * 4;
      const duration = 6 + rand() * 6;
      const opacity = 0.1 + rand() * 0.25;
      const strokeWidth = 0.5 + rand() * 1.5;

      return { id: i, y1, y2, delay, duration, opacity, strokeWidth };
    });
  }, [count]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full ${className}`}
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--migration-start)" stopOpacity="0" />
          <stop offset="30%" stopColor="var(--migration-start)" />
          <stop offset="70%" stopColor="var(--migration-end)" />
          <stop offset="100%" stopColor="var(--migration-end)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lines.map((line) => (
        <motion.path
          key={line.id}
          d={`M 0 ${line.y1} Q 50 ${(line.y1 + line.y2) / 2 - 10}, 100 ${line.y2}`}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={line.strokeWidth}
          strokeLinecap="round"
          opacity={line.opacity}
          strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: -200 }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}
