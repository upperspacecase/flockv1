"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import MigrationMap from "@/components/maps/MigrationMap";
import FlexibilityIndicator from "@/components/ui/FlexibilityIndicator";
import type { AppUser, MigrationStop } from "@/lib/app-state";
import { countries } from "@/data/countries";

// ─── Country search field ────────────────────────────────

function CountryField({
  label,
  stops,
  onChange,
  multiple = false,
}: {
  label: string;
  stops: MigrationStop[];
  onChange: (stops: MigrationStop[]) => void;
  multiple?: boolean;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) &&
          !stops.some((s) => s.countryCode === c.code)
      )
      .slice(0, 5);
  }, [query, stops]);

  const addCountry = (c: (typeof countries)[0]) => {
    const stop: MigrationStop = {
      country: c.name,
      countryCode: c.code,
      lat: c.lat,
      lng: c.lng,
    };
    if (multiple) {
      onChange([...stops, stop]);
    } else {
      onChange([stop]);
    }
    setQuery("");
  };

  const removeStop = (index: number) => {
    onChange(stops.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-muted-foreground uppercase tracking-wider block">
        {label}
      </label>

      {/* chips */}
      {stops.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {stops.map((s, i) => (
            <span
              key={`${s.countryCode}-${i}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs border border-accent/20"
            >
              {s.country}
              <button
                onClick={() => removeStop(i)}
                className="ml-0.5 text-accent/60 hover:text-accent cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* search input */}
      {(multiple || stops.length === 0) && (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country..."
            className="w-full px-3 py-2 bg-muted/50 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition-colors"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/40 rounded-xl shadow-lg z-30 overflow-hidden">
              {results.map((c) => (
                <button
                  key={c.code}
                  onClick={() => addCountry(c)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Preview mode ─────────────────────────────────────────

function ProfilePreview({ user, displayName, clerkUser }: { user: AppUser; displayName: string; clerkUser: ReturnType<typeof useUser>["user"] }) {
  const allStops: MigrationStop[] = [
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
    <div className="space-y-5">
      {/* Map */}
      <motion.div
        className="bg-card rounded-2xl p-4 border border-border/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <MigrationMap
          stops={allStops}
          futureStops={user.futurePlans}
          width={320}
          height={180}
          showLabels
          animated
        />
      </motion.div>

      {/* Avatar + Name */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-16 h-16 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shrink-0">
          {clerkUser?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clerkUser.imageUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">{displayName[0]}</span>
          )}
        </div>
        <div>
          <h1
            className="text-2xl font-light"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            {displayName}
          </h1>
        </div>
      </motion.div>

      {/* Current location — prominent */}
      <motion.div
        className="bg-accent/5 border border-accent/20 rounded-2xl p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-[10px] text-accent uppercase tracking-widest mb-1">Currently in</p>
        <p
          className="text-xl font-light text-accent"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {user.currentLocation.country}
        </p>
      </motion.div>

      {/* Origin */}
      <motion.p
        className="text-sm text-foreground/80 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {originLine}
      </motion.p>

      {/* Recent migrations */}
      {user.recentMigrations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Recent stops</p>
          <p className="text-sm text-foreground/70">
            {user.recentMigrations.map((s) => s.country).join(" → ")}
          </p>
        </motion.div>
      )}

      {/* Future plans */}
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

      {/* Last Tuesday */}
      {user.lastTuesday && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Last Tuesday</p>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {user.lastTuesday}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ─── Edit mode ────────────────────────────────────────────

interface DraftUser {
  birthCountry: MigrationStop;
  grewUp: MigrationStop[];
  recentMigrations: MigrationStop[];
  futurePlans: MigrationStop[];
  currentLocation: MigrationStop;
  flexibility: number;
  lookingFor: "romantic" | "friends" | "both";
  lastTuesday: string;
}

function ProfileEdit({
  draft,
  onChange,
}: {
  draft: DraftUser;
  onChange: (d: DraftUser) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Current location — prominent edit */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4">
        <CountryField
          label="Where are you now?"
          stops={[draft.currentLocation]}
          onChange={(stops) => {
            if (stops.length > 0) onChange({ ...draft, currentLocation: stops[0] });
          }}
        />
      </div>

      {/* Birth country */}
      <CountryField
        label="Where were you born?"
        stops={[draft.birthCountry]}
        onChange={(stops) => {
          if (stops.length > 0) onChange({ ...draft, birthCountry: stops[0] });
        }}
      />

      {/* Grew up */}
      <CountryField
        label="Where did you grow up?"
        stops={draft.grewUp}
        onChange={(stops) => onChange({ ...draft, grewUp: stops })}
        multiple
      />

      {/* Recent migrations */}
      <CountryField
        label="Recent stops"
        stops={draft.recentMigrations}
        onChange={(stops) => onChange({ ...draft, recentMigrations: stops })}
        multiple
      />

      {/* Future plans */}
      <CountryField
        label="Where are you heading?"
        stops={draft.futurePlans}
        onChange={(stops) => onChange({ ...draft, futurePlans: stops })}
        multiple
      />

      {/* Flexibility */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider block">
          Flexibility
        </label>
        <div className="flex items-center justify-between text-muted-foreground text-xs tracking-wide">
          <span>Rooted</span>
          <span>Wind-blown</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={draft.flexibility}
          onChange={(e) =>
            onChange({ ...draft, flexibility: parseFloat(e.target.value) })
          }
          className="w-full accent-[#1a1a1a] h-1.5 cursor-pointer"
        />
      </div>

      {/* Looking for */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider block">
          Looking for
        </label>
        <select
          value={draft.lookingFor}
          onChange={(e) =>
            onChange({
              ...draft,
              lookingFor: e.target.value as "romantic" | "friends" | "both",
            })
          }
          className="w-full px-3 py-2 bg-muted/50 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-accent/40 cursor-pointer"
        >
          <option value="romantic">A romantic co-migrant</option>
          <option value="friends">Fellow travelers & friends</option>
          <option value="both">Both — surprise me</option>
        </select>
      </div>

      {/* Last Tuesday */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider block">
          What did last Tuesday look like?
        </label>
        <textarea
          value={draft.lastTuesday}
          onChange={(e) => onChange({ ...draft, lastTuesday: e.target.value })}
          placeholder="Coffee in Lisbon, worked from a rooftop, got lost looking for dinner..."
          rows={3}
          className="w-full px-3 py-2 bg-muted/50 border border-border/40 rounded-xl text-sm focus:outline-none focus:border-accent/40 resize-none transition-colors"
        />
      </div>
    </div>
  );
}

// ─── Main ProfileScreen ──────────────────────────────────

interface ProfileScreenProps {
  user: AppUser | null;
  onBack: () => void;
  onUpdate: (user: AppUser) => void;
}

export default function ProfileScreen({ user, onBack, onUpdate }: ProfileScreenProps) {
  const { user: clerkUser } = useUser();
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<DraftUser | null>(null);

  if (!user) {
    return (
      <div className="h-screen-safe flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const displayName = clerkUser?.firstName || user.name;

  const startEditing = () => {
    setDraft({
      birthCountry: user.birthCountry,
      grewUp: [...user.grewUp],
      recentMigrations: [...user.recentMigrations],
      futurePlans: [...user.futurePlans],
      currentLocation: user.currentLocation,
      flexibility: user.flexibility,
      lookingFor: user.lookingFor,
      lastTuesday: user.lastTuesday || "",
    });
    setMode("edit");
  };

  const cancelEditing = () => {
    setDraft(null);
    setMode("preview");
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthCountry: draft.birthCountry,
          grewUp: draft.grewUp,
          recentMigrations: draft.recentMigrations,
          futurePlans: draft.futurePlans,
          currentLocation: draft.currentLocation,
          flexibility: draft.flexibility,
          lookingFor: draft.lookingFor,
          lastTuesday: draft.lastTuesday,
        }),
      });
      const data = await res.json();
      if (data.user) {
        onUpdate(data.user);
        setDraft(null);
        setMode("preview");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen-safe overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/40">
        <button
          onClick={mode === "edit" ? cancelEditing : onBack}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
        >
          {mode === "edit" ? "Cancel" : "← Back"}
        </button>
        <span className="text-xs text-muted-foreground tracking-wide uppercase">
          {mode === "edit" ? "Edit Profile" : "Your Migration"}
        </span>
        <button
          onClick={mode === "edit" ? handleSave : startEditing}
          disabled={saving}
          className="text-accent text-sm hover:text-accent/80 transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : mode === "edit" ? "Save" : "Edit"}
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <AnimatePresence mode="wait">
          {mode === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <ProfilePreview user={user} displayName={displayName} clerkUser={clerkUser} />
            </motion.div>
          ) : draft ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <ProfileEdit draft={draft} onChange={setDraft} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
