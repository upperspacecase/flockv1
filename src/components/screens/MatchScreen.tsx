"use client";

import { motion } from "framer-motion";
import MergedMigrationMap from "@/components/maps/MergedMigrationMap";
import type { Match } from "@/lib/app-state";
import type { UserProfile, MigrationStop } from "@/data/mock-profiles";

interface MatchScreenProps {
  match: Match;
  currentUser: UserProfile;
  onSupportTogether: (amount: number) => void;
  onJustSayHello: () => void;
}

function getAllStops(user: UserProfile): MigrationStop[] {
  return [user.birthCountry, ...user.grewUp, ...user.recentMigrations, ...user.futurePlans];
}

export default function MatchScreen({
  match,
  currentUser,
  onSupportTogether,
  onJustSayHello,
}: MatchScreenProps) {
  const stopsA = getAllStops(currentUser);
  const stopsB = getAllStops(match.user);

  return (
    <div className="h-screen-safe overflow-y-auto bg-[#1a1410] text-[#faf6f1]">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
        {/* Merged map */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MergedMigrationMap stopsA={stopsA} stopsB={stopsB} width={320} height={200} />
        </motion.div>

        {/* Match message */}
        <motion.h2
          className="text-3xl font-light mt-8 text-center"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Your flocks have merged.
        </motion.h2>

        <motion.p
          className="text-sm text-[#e8ddd1]/50 mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          You and {match.user.name} move through the world in similar ways.
        </motion.p>

        {/* Conservation invitation */}
        <motion.div
          className="w-full max-w-sm mt-10 p-5 rounded-2xl bg-[#e8ddd1]/5 border border-[#e8ddd1]/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-lg font-light mb-3" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
            {match.species.name} {match.species.imageEmoji}
          </p>
          <p className="text-sm text-[#e8ddd1]/60 leading-relaxed mb-1">
            {match.species.description}
          </p>
          <p className="text-xs text-[#e8ddd1]/40 italic mb-5">
            {match.species.funFact}
          </p>

          <p className="text-sm text-[#e8ddd1]/70 mb-4">
            Would you like to support their journey together?
          </p>

          {/* Contribution amounts */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 5].map((amount) => (
              <button
                key={amount}
                onClick={() => onSupportTogether(amount)}
                className="flex-1 py-2.5 rounded-xl bg-[#c8854c]/20 border border-[#c8854c]/30 text-[#faf6f1] text-sm hover:bg-[#c8854c]/30 transition-colors cursor-pointer"
              >
                ${amount}
              </button>
            ))}
          </div>

          <button
            onClick={onJustSayHello}
            className="w-full text-center text-sm text-[#e8ddd1]/40 hover:text-[#e8ddd1]/60 transition-colors cursor-pointer py-2"
          >
            Not now — just say hello
          </button>
        </motion.div>
      </div>
    </div>
  );
}
