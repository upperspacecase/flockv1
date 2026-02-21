"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MigrationMap from "@/components/maps/MigrationMap";
import type { AppUser, AppMatch, MigrationStop } from "@/lib/app-state";

interface DiscoverScreenProps {
  profiles: AppUser[];
  currentUser: AppUser | null;
  onMatch: (match: AppMatch) => void;
  onRefreshProfiles: () => Promise<void>;
  onNeedProfile: (profileId: string) => void;
  isProfileComplete: boolean;
}

function findOverlaps(a: MigrationStop[], b: MigrationStop[]): MigrationStop[] {
  const countriesA = new Set(a.map((s) => s.country));
  return b.filter((s) => countriesA.has(s.country));
}

function getOverlapPhrase(count: number): string {
  if (count === 0) return "Different paths, same spirit";
  if (count === 1) return "Your paths cross in 1 place";
  return `Your paths cross in ${count} places`;
}

function SwipeCard({
  profile,
  currentUser,
  onSwipeLeft,
  onSwipeRight,
  isTop,
}: {
  profile: AppUser;
  currentUser: AppUser | null;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const cardOpacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const passLabelOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const connectLabelOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);

  const allStops = [
    profile.birthCountry,
    ...profile.grewUp,
    ...profile.recentMigrations,
  ];

  const userStops = currentUser
    ? [
      currentUser.birthCountry,
      ...currentUser.grewUp,
      ...currentUser.recentMigrations,
      ...currentUser.futurePlans,
    ]
    : [];
  const profileStops = [...allStops, ...profile.futurePlans];
  const overlaps = currentUser ? findOverlaps(userStops, profileStops) : [];

  const originLine = `Born in ${profile.birthCountry.country}${profile.grewUp.length > 0
      ? `, raised between ${profile.grewUp.map((s) => s.country).join(" and ")}`
      : ""
    }`;

  const futureLine =
    profile.futurePlans.length > 0
      ? `Heading to ${profile.futurePlans.map((s) => s.country).join(" → ")}`
      : null;

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onSwipeRight();
    } else if (info.offset.x < -100 || info.velocity.x < -500) {
      onSwipeLeft();
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-x-4 top-0 bg-card rounded-2xl border border-border/40 overflow-hidden"
        style={{ height: "calc(100% - 80px)" }}
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 0.95, y: 10 }}
      >
        <div className="p-4 opacity-30">
          <MigrationMap stops={allStops} width={300} height={140} compact animated={false} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-x-4 top-0 bg-card rounded-2xl border border-border/40 overflow-hidden cursor-grab active:cursor-grabbing shadow-lg"
      style={{ x, rotate, opacity: cardOpacity, height: "calc(100% - 80px)" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 400 : -400,
        y: x.get() > 0 ? -80 : 20,
        opacity: 0,
        rotate: x.get() > 0 ? 15 : -15,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="h-full overflow-y-auto">
        <div className="p-4 pb-2">
          <MigrationMap
            stops={allStops}
            futureStops={profile.futurePlans}
            overlappingStops={overlaps}
            width={300}
            height={150}
            showLabels
            animated
          />
        </div>

        <div className="px-5 pb-2">
          <p className="text-xs text-accent font-medium">
            {getOverlapPhrase(overlaps.length)}
          </p>
        </div>

        <div className="px-5 pb-6 space-y-3">
          <div className="flex items-center gap-3">
            {profile.photos?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                <span className="text-lg">{(profile.name || "?")[0]}</span>
              </div>
            )}
            <div>
              <h3
                className="text-xl font-light"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                {profile.name || "Anonymous"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Currently in {profile.currentLocation.country}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground/70">{originLine}</p>

          {futureLine && (
            <div className="flex items-start gap-2">
              <span className="text-accent text-xs mt-0.5">→</span>
              <p className="text-sm text-foreground/50 italic">{futureLine}</p>
            </div>
          )}

          {profile.lastTuesday && (
            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Tuesday</p>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {profile.lastTuesday}
              </p>
            </div>
          )}

          <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {profile.lookingFor === "romantic"
              ? "Looking for romance"
              : profile.lookingFor === "friends"
                ? "Looking for friends"
                : "Open to anything"}
          </span>
        </div>
      </div>

      <motion.div
        className="absolute top-6 left-6 px-3 py-1.5 rounded-lg border-2 border-red-400/60 text-red-400 text-sm font-medium rotate-[-12deg]"
        style={{ opacity: passLabelOpacity }}
      >
        Pass
      </motion.div>
      <motion.div
        className="absolute top-6 right-6 px-3 py-1.5 rounded-lg border-2 border-[#1a1a1a]/60 text-[#1a1a1a] text-sm font-medium rotate-[12deg]"
        style={{ opacity: connectLabelOpacity }}
      >
        Connect
      </motion.div>
    </motion.div>
  );
}

export default function DiscoverScreen({
  profiles,
  currentUser,
  onMatch,
  onRefreshProfiles,
  onNeedProfile,
  isProfileComplete,
}: DiscoverScreenProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [liking, setLiking] = useState(false);

  const remaining = profiles.filter((p) => !dismissed.has(p._id));
  const visibleProfiles = remaining.slice(0, 2);

  const handleSwipeLeft = () => {
    if (remaining.length === 0) return;
    setDismissed((prev) => new Set([...prev, remaining[0]._id]));
  };

  const handleSwipeRight = async () => {
    if (remaining.length === 0 || liking) return;
    const profile = remaining[0];
    setDismissed((prev) => new Set([...prev, profile._id]));
    setLiking(true);

    if (!isProfileComplete) {
      setLiking(false);
      onNeedProfile(profile._id);
      return;
    }

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedUserId: profile._id }),
      });
      const data = await res.json();
      if (data.matched && data.match) {
        onMatch(data.match);
      }
    } catch (err) {
      console.error("Failed to like:", err);
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative px-0 py-4">
        <AnimatePresence mode="popLayout">
          {visibleProfiles.length > 0 ? (
            visibleProfiles
              .map((profile, i) => (
                <SwipeCard
                  key={profile._id}
                  profile={profile}
                  currentUser={currentUser}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  isTop={i === 0}
                />
              ))
              .reverse()
          ) : (
            <motion.div
              key="empty"
              className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p
                className="text-2xl font-light text-muted-foreground mb-2"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                The flock is resting.
              </p>
              <p className="text-sm text-muted-foreground/60">
                Check back as more travelers arrive.
              </p>
              <div className="mt-8 text-4xl opacity-40">🐦🐦🐦</div>
              <button
                onClick={() => {
                  setDismissed(new Set());
                  onRefreshProfiles();
                }}
                className="mt-6 px-6 py-2 rounded-full border border-[#1a1a1a] text-sm text-[#1a1a1a] tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {visibleProfiles.length > 0 && (
        <div className="flex items-center justify-center gap-8 pb-4 pt-2">
          <button
            onClick={handleSwipeLeft}
            className="w-14 h-14 rounded-full border-2 border-[#ddd] hover:border-[#999] flex items-center justify-center text-xl text-[#bbb] hover:text-[#999] transition-colors cursor-pointer"
            title="Pass"
          >
            ✕
          </button>
          <button
            onClick={handleSwipeRight}
            disabled={liking}
            className="w-14 h-14 rounded-full border-2 border-[#1a1a1a] bg-[#1a1a1a] flex items-center justify-center text-xl text-white hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
            title="Connect"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}
