"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useApp, type AppMatch } from "@/lib/app-state";

interface ConservationScreenProps {
  onBack: () => void;
}

export default function ConservationScreen({ onBack }: ConservationScreenProps) {
  const { matches, refreshMatches } = useApp();

  useEffect(() => {
    refreshMatches();
  }, [refreshMatches]);

  const contributions = matches
    .filter((m) => m.contributedAmount > 0)
    .sort((a, b) => b.contributedAmount - a.contributedAmount);

  const totalContributed = contributions.reduce(
    (sum, m) => sum + m.contributedAmount,
    0
  );

  const uniqueSpecies = [
    ...new Map(contributions.map((m) => [m.species.id, m.species])).values(),
  ];

  return (
    <div className="h-screen-safe overflow-y-auto bg-background">
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/40">
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

      <div className="px-6 py-6 space-y-6">
        {/* Impact summary */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs text-muted-foreground tracking-wide uppercase mb-2">
            Your Conservation Impact
          </p>
          <p
            className="text-5xl font-light text-accent"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            ${totalContributed}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Supporting {uniqueSpecies.length} migratory species
          </p>
        </motion.div>

        {/* Species supported */}
        {uniqueSpecies.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-xs text-muted-foreground tracking-wide uppercase">
              Species Supported
            </h2>
            <div className="grid gap-2">
              {uniqueSpecies.map((species) => {
                const speciesTotal = contributions
                  .filter((m) => m.species.id === species.id)
                  .reduce((sum, m) => sum + m.contributedAmount, 0);

                return (
                  <div
                    key={species.id}
                    className="flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{species.imageEmoji}</span>
                      <span className="text-sm">{species.name}</span>
                    </div>
                    <span className="text-sm text-accent">${speciesTotal}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Match contributions */}
        {contributions.length > 0 ? (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-xs text-muted-foreground tracking-wide uppercase">
              Contributions
            </h2>
            <div className="space-y-2">
              {contributions.map((match) => {
                const otherUser = match.otherUser || match.userB;
                return (
                  <div
                    key={match._id}
                    className="flex items-center justify-between px-4 py-3 bg-card rounded-xl border border-border/40"
                  >
                    <div>
                      <p className="text-sm">
                        With {otherUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {match.species.name} {match.species.imageEmoji}
                      </p>
                    </div>
                    <span className="text-sm text-accent font-medium">
                      ${match.contributedAmount}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground/60 leading-relaxed max-w-[260px] mx-auto">
              When you match and contribute to conservation, your impact will
              appear here.
            </p>
            <div className="mt-4 text-3xl opacity-30">🌿</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
