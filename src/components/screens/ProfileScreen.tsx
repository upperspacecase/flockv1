"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import MigrationMap from "@/components/maps/MigrationMap";
import FlexibilityIndicator from "@/components/ui/FlexibilityIndicator";
import type { AppUser, MigrationStop } from "@/lib/app-state";
import { countries } from "@/data/countries";

interface ProfileScreenProps {
  user: AppUser | null;
  onBack: () => void;
  onUpdate: (user: AppUser) => void;
}

export default function ProfileScreen({ user, onBack, onUpdate }: ProfileScreenProps) {
  const { user: clerkUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [flexibility, setFlexibility] = useState(user?.flexibility || 0.5);
  const [lookingFor, setLookingFor] = useState<"romantic" | "friends" | "both">(
    user?.lookingFor || "both"
  );
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="h-screen-safe flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const displayName = clerkUser?.firstName || user.name;
  const allStops: MigrationStop[] = [
    user.birthCountry,
    ...user.grewUp,
    ...user.recentMigrations,
  ];

  const originLine = `Born in ${user.birthCountry.country}${user.grewUp.length > 0
    ? `, raised between ${user.grewUp.map((s) => s.country).join(" and ")}`
    : ""
    }`;

  const futureLine =
    user.futurePlans.length > 0
      ? `Heading to ${user.futurePlans.map((s) => s.country).join(" → ")}`
      : null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, flexibility, lookingFor }),
      });
      const data = await res.json();
      if (data.user) {
        onUpdate(data.user);
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen-safe overflow-y-auto bg-background">
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
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
          className="text-accent text-sm hover:text-accent/80 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : editing ? "Save" : "Edit"}
        </button>
      </div>

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

      <div className="px-6 py-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className="text-2xl font-light"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {displayName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Currently in {user.currentLocation.country}
          </p>
        </motion.div>

        <motion.p
          className="text-sm text-foreground/80 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {originLine}
        </motion.p>

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
          {editing ? (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Flexibility</label>
              <div className="flex items-center justify-between text-[#888] text-xs tracking-wide">
                <span>Rooted</span>
                <span>Wind-blown</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={flexibility}
                onChange={(e) => setFlexibility(parseFloat(e.target.value))}
                className="w-full accent-[#1a1a1a] h-1.5 cursor-pointer"
              />
            </div>
          ) : (
            <FlexibilityIndicator value={user.flexibility} />
          )}
        </motion.div>

        {/* Looking for */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <span className="text-xs text-muted-foreground">Looking for:</span>
          {editing ? (
            <select
              value={lookingFor}
              onChange={(e) =>
                setLookingFor(e.target.value as "romantic" | "friends" | "both")
              }
              className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 cursor-pointer"
            >
              <option value="romantic">A romantic co-migrant</option>
              <option value="friends">Fellow travelers & friends</option>
              <option value="both">Both — surprise me</option>
            </select>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              {user.lookingFor === "romantic"
                ? "A romantic co-migrant"
                : user.lookingFor === "friends"
                  ? "Fellow travelers & friends"
                  : "Both — surprise me"}
            </span>
          )}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {editing ? (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your flock about you..."
                rows={3}
                className="w-full px-3 py-2 bg-muted/50 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-accent/40 resize-none transition-colors"
              />
            </div>
          ) : user.bio ? (
            <p className="text-sm text-foreground/70 leading-relaxed">
              {user.bio}
            </p>
          ) : null}
        </motion.div>

        {/* Clerk avatar */}
        <motion.div
          className="w-20 h-20 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: "spring" }}
        >
          {clerkUser?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clerkUser.imageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl">{displayName[0]}</span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
