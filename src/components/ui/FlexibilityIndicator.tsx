"use client";

interface FlexibilityIndicatorProps {
  value: number; // 0 = rooted, 1 = wind-blown
  className?: string;
}

export default function FlexibilityIndicator({
  value,
  className = "",
}: FlexibilityIndicatorProps) {
  const label =
    value < 0.3
      ? "Rooted"
      : value < 0.5
        ? "Mostly rooted"
        : value < 0.7
          ? "Flexible"
          : value < 0.9
            ? "Wind-blown"
            : "Free as a bird";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Tree icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M12 2L7 10h3v4H7l5 8 5-8h-3v-4h3L12 2z"
          fill="var(--foreground)"
          opacity={1 - value * 0.6}
        />
      </svg>

      <div className="flex-1">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${value * 100}%`,
              background: `linear-gradient(to right, var(--migration-start), var(--migration-end))`,
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
      </div>

      {/* Bird icon */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
        <path
          d="M3 12c3-4 7-6 9-5s2 4 0 6c4-1 7-3 9-5-2 5-6 8-10 8S3 14 3 12z"
          fill="var(--foreground)"
          opacity={0.4 + value * 0.6}
        />
      </svg>
    </div>
  );
}
