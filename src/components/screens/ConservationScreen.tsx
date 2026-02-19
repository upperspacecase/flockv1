"use client";

import { motion } from "framer-motion";
import type { Match } from "@/lib/app-state";

interface ConservationScreenProps {
  matches: Match[];
  onBack: () => void;
}

export default function ConservationScreen({
  matches,
  onBack,
}: ConservationScreenProps) {
  const contributedMatches = matches.filter((m) => m.contributedAmount);
  const totalContributed = contributedMatches.reduce(
    (sum, m) => sum + (m.contributedAmount || 0),
    0
  );
  const uniqueSpecies = [
    ...new Set(contributedMatches.map((m) => m.species.id)),
  ].map((id) => contributedMatches.find((m) => m.species.id === id)!.species);

  return (
    <div className="h-screen-safe overflow-y-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <button
          onClick={onBack}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <h1
          className="text-lg font-light tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Conservation
        </h1>
        <div className="w-12" />
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Hero stat */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {totalContributed > 0 ? (
            <>
              <p
                className="text-5xl font-light text-accent"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                ${totalContributed}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                contributed together with your flock
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4 opacity-30">🌍</div>
              <p
                className="text-xl font-light text-muted-foreground"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Your conservation journey begins with your first match.
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                When you connect with someone, you&apos;ll be invited to support
                migratory species together.
              </p>
            </>
          )}
        </motion.div>

        {/* Species supported */}
        {uniqueSpecies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs text-muted-foreground tracking-widest uppercase">
              Species you&apos;ve supported
            </h2>
            {uniqueSpecies.map((species, i) => (
              <motion.div
                key={species.id}
                className="p-4 rounded-xl bg-card border border-border/40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 + 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{species.imageEmoji}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{species.name}</h3>
                    <p className="text-xs text-muted-foreground italic">
                      {species.scientificName}
                    </p>
                    <p className="text-xs text-foreground/60 mt-2 leading-relaxed">
                      {species.description}
                    </p>
                    <p className="text-xs text-accent mt-2">
                      Migration: {species.migrationRoute}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contributions log */}
        {contributedMatches.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs text-muted-foreground tracking-widest uppercase">
              Your contributions
            </h2>
            {contributedMatches.map((m, i) => (
              <motion.div
                key={`${m.user.id}-${i}`}
                className="flex items-center justify-between py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                    {m.user.name[0]}
                  </div>
                  <span className="text-sm">
                    with {m.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {m.species.name} {m.species.imageEmoji}
                  </span>
                </div>
                <span className="text-sm text-accent font-medium">
                  ${m.contributedAmount}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Nature reminder */}
        <motion.div
          className="text-center py-6 opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-muted-foreground italic leading-relaxed max-w-[280px] mx-auto">
            Migratory species supporting migratory species. Every connection
            creates a ripple that reaches further than you can see.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
