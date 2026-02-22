"use client";

import { motion } from "framer-motion";
import MergedMigrationMap from "@/components/maps/MergedMigrationMap";
import BirdCelebration from "@/components/ui/BirdCelebration";
import type { AppMatch, AppUser, MigrationStop } from "@/lib/app-state";

interface MatchScreenProps {
  match: AppMatch;
  currentUser: AppUser | null;
  onSupportTogether: (amount: number) => void;
  onJustSayHello: () => void;
}

function getAllStops(user: AppUser): MigrationStop[] {
  return [
    user.birthCountry,
    ...user.grewUp,
    ...user.recentMigrations,
    ...user.futurePlans,
  ];
}

export default function MatchScreen({
  match,
  currentUser,
  onSupportTogether,
  onJustSayHello,
}: MatchScreenProps) {
  const otherUser = match.otherUser || match.userB;
  const stopsA = currentUser ? getAllStops(currentUser) : [];
  const stopsB = getAllStops(otherUser);

  return (
    <div className="h-screen-safe overflow-y-auto bg-[#fefefe] text-[#1a1a1a] relative">
      {/* Bird celebration animation */}
      <BirdCelebration />

      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Merged map */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MergedMigrationMap
            stopsA={stopsA}
            stopsB={stopsB}
            width={320}
            height={200}
          />
        </motion.div>

        {/* Match message */}
        <motion.h2
          className="text-3xl font-light mt-8 text-center"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          Your flocks have merged.
        </motion.h2>

        <motion.p
          className="text-sm text-[#888] mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          You and {otherUser.name} move through the world in similar ways.
        </motion.p>

        {/* Conservation invitation */}
        <motion.div
          className="w-full max-w-sm mt-10 p-5 rounded-2xl bg-[#f8f8f8] border border-[#e0e0e0]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p
            className="text-lg font-light mb-3"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
          >
            {match.species.name}
          </p>
          <p className="text-sm text-[#888] leading-relaxed mb-5">
            Would you like to support their journey together?
          </p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 5].map((amount) => (
              <button
                key={amount}
                onClick={() => onSupportTogether(amount)}
                className="flex-1 py-2.5 rounded-xl border border-[#1a1a1a] text-[#1a1a1a] text-sm hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              >
                ${amount}
              </button>
            ))}
          </div>

          <button
            onClick={onJustSayHello}
            className="w-full text-center text-sm text-[#999] hover:text-[#1a1a1a] transition-colors cursor-pointer py-2"
          >
            Not now — just say hello
          </button>
        </motion.div>
      </div>
    </div>
  );
}
