"use client";

import { motion } from "framer-motion";
import MigrationMap from "@/components/maps/MigrationMap";
import FlexibilityIndicator from "@/components/ui/FlexibilityIndicator";
import type { UserProfile } from "@/data/mock-profiles";

interface ProfileScreenProps {
  user: UserProfile;
  onBack: () => void;
}

export default function ProfileScreen({ user, onBack }: ProfileScreenProps) {
  const allStops = [
    user.birthCountry,
    ...user.grewUp,
    ...user.recentMigrations,
  ];

  const originLine = `Born in ${user.birthCountry.country}${
    user.grewUp.length > 0
      ? `, raised between ${user.grewUp.map((s) => s.country).join(" and ")}`
      : ""
  }`;

  const futureLine =
    user.futurePlans.length > 0
      ? `Heading to ${user.futurePlans.map((s) => s.country).join(" → ")}`
      : null;

  return (
    <div className="h-screen-safe overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/40">
        <button
          onClick={onBack}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <span className="text-xs text-muted-foreground tracking-wide uppercase">
          Your Migration
        </span>
        <div className="w-12" />
      </div>

      {/* Migration map hero */}
      <motion.div
        className="px-4 pt-6 pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-card rounded-2xl p-4 border border-border/40">
          <MigrationMap
            stops={allStops}
            futureStops={user.futurePlans}
            width={320}
            height={180}
            showLabels
            animated
          />
        </div>
      </motion.div>

      {/* Profile content */}
      <div className="px-6 py-4 space-y-5">
        {/* Name and location */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-2xl font-light"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Currently in {user.currentLocation.country}
          </p>
        </motion.div>

        {/* Origin line */}
        <motion.p
          className="text-sm text-foreground/80 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {originLine}
        </motion.p>

        {/* Future path */}
        {futureLine && (
          <motion.div
            className="flex items-start gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-accent text-xs mt-0.5">→</span>
            <p className="text-sm text-foreground/60 italic">{futureLine}</p>
          </motion.div>
        )}

        {/* Flexibility */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <FlexibilityIndicator value={user.flexibility} />
        </motion.div>

        {/* Looking for */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-xs text-muted-foreground">Looking for:</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            {user.lookingFor === "romantic"
              ? "A romantic co-migrant"
              : user.lookingFor === "friends"
                ? "Fellow travelers & friends"
                : "Both — surprise me"}
          </span>
        </motion.div>

        {/* Photo placeholder */}
        <motion.div
          className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
        >
          <span className="text-2xl">
            {user.name[0]}
          </span>
        </motion.div>

        {/* Bio */}
        {user.bio && (
          <motion.p
            className="text-sm text-foreground/70 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    </div>
  );
}
