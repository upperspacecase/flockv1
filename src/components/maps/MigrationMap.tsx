"use client";

import { motion } from "framer-motion";
import type { MigrationStop } from "@/lib/app-state";

interface MigrationMapProps {
  stops: MigrationStop[];
  futureStops?: MigrationStop[];
  overlappingStops?: MigrationStop[];
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
  showLabels?: boolean;
  compact?: boolean;
}

function geoToSvg(
  lat: number,
  lng: number,
  width: number,
  height: number
): { x: number; y: number } {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

function buildCurvePath(
  points: { x: number; y: number }[]
): string {
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

export default function MigrationMap({
  stops,
  futureStops = [],
  overlappingStops = [],
  width = 320,
  height = 180,
  className = "",
  animated = true,
  showLabels = false,
  compact = false,
}: MigrationMapProps) {
  const allStops = [...stops, ...futureStops];
  const svgPoints = allStops.map((s) => ({
    ...geoToSvg(s.lat, s.lng, width, height),
    country: s.country,
    isFuture: futureStops.includes(s),
  }));

  const pastPoints = stops.map((s) => geoToSvg(s.lat, s.lng, width, height));
  const futurePoints =
    futureStops.length > 0
      ? [
        geoToSvg(
          stops[stops.length - 1].lat,
          stops[stops.length - 1].lng,
          width,
          height
        ),
        ...futureStops.map((s) => geoToSvg(s.lat, s.lng, width, height)),
      ]
      : [];

  const overlapSet = new Set(overlappingStops.map((s) => s.country));

  const pastPath = buildCurvePath(pastPoints);
  const futurePath = buildCurvePath(futurePoints);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="migrationGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--migration-start)" />
          <stop offset="100%" stopColor="var(--migration-end)" />
        </linearGradient>
        <linearGradient id="futureGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--migration-end)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--migration-end)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Subtle grid/topo lines */}
      {!compact &&
        [0.25, 0.5, 0.75].map((r) => (
          <line
            key={`h-${r}`}
            x1={0}
            y1={height * r}
            x2={width}
            y2={height * r}
            stroke="var(--border)"
            strokeWidth="0.3"
            strokeDasharray="4 8"
            opacity={0.3}
          />
        ))}

      {/* Past migration path */}
      {pastPath && (
        <motion.path
          d={pastPath}
          fill="none"
          stroke="url(#migrationGrad)"
          strokeWidth={compact ? 1.5 : 2}
          strokeLinecap="round"
          strokeDasharray="500"
          initial={animated ? { strokeDashoffset: 500 } : { strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      )}

      {/* Future migration path */}
      {futurePath && (
        <motion.path
          d={futurePath}
          fill="none"
          stroke="url(#futureGrad)"
          strokeWidth={compact ? 1 : 1.5}
          strokeLinecap="round"
          strokeDasharray="4 6"
          initial={animated ? { opacity: 0 } : { opacity: 0.6 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2, delay: 2 }}
        />
      )}

      {/* Stop dots */}
      {svgPoints.map((pt, i) => {
        const isOverlap = overlapSet.has(pt.country);
        const isFut = pt.isFuture;
        const dotRadius = compact ? 2.5 : 3.5;

        return (
          <g key={`${pt.country}-${i}`}>
            {isOverlap && (
              <motion.circle
                cx={pt.x}
                cy={pt.y}
                r={dotRadius * 2.5}
                fill="var(--overlap-glow)"
                filter="url(#glowFilter)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            )}
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={dotRadius}
              fill={
                isFut
                  ? "var(--migration-end)"
                  : isOverlap
                    ? "var(--accent)"
                    : "var(--migration-start)"
              }
              opacity={isFut ? 0.5 : 1}
              initial={animated ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: i * 0.15 + 0.5,
              }}
            />
            {showLabels && !compact && (
              <motion.text
                x={pt.x}
                y={pt.y - (compact ? 5 : 8)}
                textAnchor="middle"
                fontSize={compact ? 5 : 7}
                fill="var(--foreground)"
                opacity={0.7}
                initial={animated ? { opacity: 0 } : { opacity: 0.7 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: i * 0.15 + 1 }}
              >
                {pt.country}
              </motion.text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
