"use client";

import { motion } from "framer-motion";
import type { MigrationStop } from "@/data/mock-profiles";

interface MergedMigrationMapProps {
  stopsA: MigrationStop[];
  stopsB: MigrationStop[];
  width?: number;
  height?: number;
  className?: string;
}

function geoToSvg(lat: number, lng: number, w: number, h: number) {
  return { x: ((lng + 180) / 360) * w, y: ((90 - lat) / 180) * h };
}

function buildCurve(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpy1 = prev.y - Math.abs(curr.x - prev.x) * 0.08;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    const cpy2 = curr.y - Math.abs(curr.x - prev.x) * 0.08;
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function MergedMigrationMap({
  stopsA,
  stopsB,
  width = 320,
  height = 200,
  className = "",
}: MergedMigrationMapProps) {
  const ptsA = stopsA.map((s) => ({
    ...geoToSvg(s.lat, s.lng, width, height),
    country: s.country,
  }));
  const ptsB = stopsB.map((s) => ({
    ...geoToSvg(s.lat, s.lng, width, height),
    country: s.country,
  }));

  const pathA = buildCurve(ptsA);
  const pathB = buildCurve(ptsB);

  // Find overlapping countries
  const countriesA = new Set(stopsA.map((s) => s.country));
  const overlaps = stopsB.filter((s) => countriesA.has(s.country));
  const overlapPts = overlaps.map((s) => geoToSvg(s.lat, s.lng, width, height));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--migration-start)" />
          <stop offset="100%" stopColor="var(--migration-end)" />
        </linearGradient>
        <linearGradient id="gradB" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.6" />
        </linearGradient>
        <filter id="mergeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Topo lines */}
      {[0.25, 0.5, 0.75].map((r) => (
        <line
          key={r}
          x1={0}
          y1={height * r}
          x2={width}
          y2={height * r}
          stroke="var(--border)"
          strokeWidth="0.3"
          strokeDasharray="4 8"
          opacity={0.2}
        />
      ))}

      {/* Path A */}
      <motion.path
        d={pathA}
        fill="none"
        stroke="url(#gradA)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="600"
        initial={{ strokeDashoffset: 600 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Path B */}
      <motion.path
        d={pathB}
        fill="none"
        stroke="url(#gradB)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="600"
        initial={{ strokeDashoffset: 600 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
      />

      {/* All dots for A */}
      {ptsA.map((pt, i) => (
        <motion.circle
          key={`a-${i}`}
          cx={pt.x}
          cy={pt.y}
          r={3}
          fill="var(--migration-start)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: i * 0.15 + 0.5 }}
        />
      ))}

      {/* All dots for B */}
      {ptsB.map((pt, i) => (
        <motion.circle
          key={`b-${i}`}
          cx={pt.x}
          cy={pt.y}
          r={3}
          fill="var(--teal)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: i * 0.15 + 1 }}
        />
      ))}

      {/* Overlap glow */}
      {overlapPts.map((pt, i) => (
        <motion.circle
          key={`overlap-${i}`}
          cx={pt.x}
          cy={pt.y}
          r={10}
          fill="var(--overlap-glow)"
          filter="url(#mergeGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 + 2 }}
        />
      ))}
    </svg>
  );
}
