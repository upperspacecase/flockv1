"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { UserButton } from "@clerk/nextjs";
import MigrationMap from "@/components/maps/MigrationMap";
import FlexibilityIndicator from "@/components/ui/FlexibilityIndicator";
import type { AppUser, AppMatch, MigrationStop } from "@/lib/app-state";

interface DiscoverScreenProps {
  profiles: AppUser[];
  currentUser: AppUser | null;
  onMatch: (match: AppMatch) => void;
  onOpenProfile: () => void;
  onOpenMessages: () => void;
  onOpenConservation: () => void;
  onOpenFlock: () => void;
  onRefreshProfiles: () => Promise<void>;
  onNeedProfile: (profileId: string) => void;
  isProfileComplete: boolean;
  hasNewActivity?: boolean;
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

/* ─── Profile Card (Hinge-style scrollable) ─── */

function ProfileCard({
  profile,
  currentUser,
}: {
  profile: AppUser;
  currentUser: AppUser | null;
}) {
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
      ? `, grew up in ${profile.grewUp.map((s) => s.country).join(" & ")}`
      : ""
    }`;

  const recentLine =
    profile.recentMigrations.length > 0
      ? profile.recentMigrations.map((s) => s.country).join(" → ")
      : null;

  const futureLine =
    profile.futurePlans.length > 0
      ? profile.futurePlans.map((s) => s.country).join(" → ")
      : null;

  return (
    <div className="space-y-0">
      {/* Photo 1 — hero */}
      {profile.photos?.[0] ? (
        <div className="relative w-full aspect-[3/4] bg-[#f0f0f0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photos[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
            <h2
              className="text-2xl font-light text-white"
              style={{ fontFamily: "Georgia, Cambria, serif" }}
            >
              {profile.name || "Anonymous"}
            </h2>
            <p className="text-sm text-white/70 mt-0.5">
              {profile.currentLocation?.country}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-[3/4] bg-[#f0f0f0] flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl block mb-2">
              {(profile.name || "?")[0]}
            </span>
            <h2
              className="text-2xl font-light text-[#1a1a1a]"
              style={{ fontFamily: "Georgia, Cambria, serif" }}
            >
              {profile.name || "Anonymous"}
            </h2>
            <p className="text-sm text-[#888] mt-1">
              {profile.currentLocation?.country}
            </p>
          </div>
        </div>
      )}

      {/* Origin prompt */}
      <div className="px-5 py-5 border-b border-[#f0f0f0]">
        <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
          My journey began
        </p>
        <p className="text-[15px] text-[#1a1a1a] leading-relaxed">
          {originLine}
        </p>
      </div>

      {/* Migration map */}
      <div className="px-5 py-5 border-b border-[#f0f0f0]">
        <p className="text-xs text-[#999] uppercase tracking-wider mb-3">
          Migration path
        </p>
        <div className="bg-[#f8f8f8] rounded-xl p-3 border border-[#eee]">
          <MigrationMap
            stops={allStops}
            futureStops={profile.futurePlans}
            overlappingStops={overlaps}
            width={300}
            height={160}
            showLabels
            animated
          />
        </div>
        <p className="text-xs text-[#1a1a1a] font-medium mt-3">
          {getOverlapPhrase(overlaps.length)}
        </p>
      </div>

      {/* Photo 2 */}
      {profile.photos?.[1] && (
        <div className="w-full aspect-[4/3] bg-[#f0f0f0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.photos[1]}
            alt={`${profile.name} photo 2`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Recent migrations */}
      {recentLine && (
        <div className="px-5 py-5 border-b border-[#f0f0f0]">
          <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
            Recently been to
          </p>
          <p className="text-[15px] text-[#1a1a1a]">{recentLine}</p>
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div className="px-5 py-5 border-b border-[#f0f0f0]">
          <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
            About me
          </p>
          <p className="text-[15px] text-[#1a1a1a] leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Future plans */}
      {futureLine && (
        <div className="px-5 py-5 border-b border-[#f0f0f0]">
          <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
            Heading next
          </p>
          <p className="text-[15px] text-[#1a1a1a] italic">{futureLine}</p>
        </div>
      )}

      {/* Flexibility + looking for */}
      <div className="px-5 py-5 border-b border-[#f0f0f0]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#999] uppercase tracking-wider mb-2">
              Looking for
            </p>
            <p className="text-sm text-[#1a1a1a]">
              {profile.lookingFor === "romantic"
                ? "A romantic co-migrant"
                : profile.lookingFor === "friends"
                  ? "Fellow travelers"
                  : "Open to anything"}
            </p>
          </div>
          <div className="w-20">
            <FlexibilityIndicator value={profile.flexibility} />
          </div>
        </div>
      </div>

      {/* Bottom spacer for action bar */}
      <div className="h-24" />
    </div>
  );
}

/* ─── Main Discover Screen ─── */

export default function DiscoverScreen({
  profiles,
  currentUser,
  onMatch,
  onOpenProfile,
  onOpenMessages,
  onOpenConservation,
  onOpenFlock,
  onRefreshProfiles,
  onNeedProfile,
  isProfileComplete,
  hasNewActivity,
}: DiscoverScreenProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [liking, setLiking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const remaining = profiles.filter((p) => !dismissed.has(p._id));
  const currentProfile = remaining[0] || null;

  const advance = () => {
    if (!currentProfile) return;
    setDismissed((prev) => new Set([...prev, currentProfile._id]));
    // Scroll to top for next profile
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  const handlePass = () => {
    advance();
  };

  const handleConnect = async () => {
    if (!currentProfile || liking) return;

    // Gate: require profile before liking
    if (!isProfileComplete) {
      onNeedProfile(currentProfile._id);
      return;
    }

    advance();
    setLiking(true);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likedUserId: currentProfile._id }),
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
    <div className="h-screen-safe flex flex-col bg-[#fefefe]">
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#f0f0f0] bg-[#fefefe]/90 backdrop-blur-sm z-10">
        <UserButton
          appearance={{
            elements: { userButtonAvatarBox: "w-8 h-8" },
          }}
        />
        <h1
          className="text-base font-light tracking-wider uppercase text-[#1a1a1a]"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
        >
          Discover
        </h1>
        <div className="flex gap-1.5">
          <button
            onClick={onOpenConservation}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            title="Conservation"
          >
            🌿
          </button>
          <button
            onClick={onOpenFlock}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            title="Your Flock"
          >
            🐦
            {hasNewActivity && (
              <span className="absolute -top-0.5 -right-0.5 text-[9px] leading-none">🍃</span>
            )}
          </button>
          <button
            onClick={onOpenMessages}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer hover:bg-[#f0f0f0] transition-colors"
            title="Messages"
          >
            💬
          </button>
        </div>
      </div>

      {/* Scrollable profile */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentProfile ? (
            <motion.div
              key={currentProfile._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <ProfileCard
                profile={currentProfile}
                currentUser={currentUser}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center px-8 text-center py-24"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p
                className="text-xl font-light text-[#999] mb-2"
                style={{ fontFamily: "Georgia, Cambria, serif" }}
              >
                The flock is resting.
              </p>
              <p className="text-sm text-[#ccc]">
                Check back as more travelers arrive.
              </p>
              <div className="mt-6 text-3xl opacity-30">🐦🐦🐦</div>
              <button
                onClick={() => {
                  setDismissed(new Set());
                  onRefreshProfiles();
                }}
                className="mt-6 px-6 py-2.5 rounded-full border border-[#1a1a1a] text-sm text-[#1a1a1a] tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed bottom action bar */}
      {currentProfile && (
        <div className="flex items-center justify-center gap-10 py-4 pb-6 border-t border-[#f0f0f0] bg-[#fefefe]">
          <button
            onClick={handlePass}
            className="w-14 h-14 rounded-full border-2 border-[#ddd] flex items-center justify-center text-lg text-[#bbb] hover:border-[#999] hover:text-[#999] transition-colors cursor-pointer active:scale-95"
            title="Pass"
          >
            ✕
          </button>
          <button
            onClick={handleConnect}
            disabled={liking}
            className="w-16 h-16 rounded-full border-2 border-[#1a1a1a] bg-[#1a1a1a] flex items-center justify-center text-xl text-white hover:bg-[#333] transition-colors cursor-pointer active:scale-95 disabled:opacity-50"
            title="Connect"
          >
            ♥
          </button>
        </div>
      )}
    </div>
  );
}
