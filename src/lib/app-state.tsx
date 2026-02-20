"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useUser } from "@clerk/nextjs";

// ─── Types ───────────────────────────────────────────────

export interface MigrationStop {
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  year?: number;
  season?: string;
}

export interface AppUser {
  _id: string;
  clerkId: string;
  name: string;
  age: number;
  photo: string;
  bio?: string;
  birthCountry: MigrationStop;
  grewUp: MigrationStop[];
  recentMigrations: MigrationStop[];
  futurePlans: MigrationStop[];
  currentLocation: MigrationStop;
  flexibility: number;
  lookingFor: "romantic" | "friends" | "both";
  hasOnboarded: boolean;
}

export interface AppMatch {
  _id: string;
  userA: AppUser;
  userB: AppUser;
  otherUser: AppUser;
  species: {
    id: string;
    name: string;
    imageEmoji: string;
  };
  compatibilityScore: number;
  contributedAmount: number;
  createdAt: string;
}

export type AppScreen =
  | "splash"
  | "onboarding"
  | "auth"
  | "discover"
  | "profile"
  | "messages"
  | "conservation"
  | "match";

// ─── Context ─────────────────────────────────────────────

interface AppState {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  dbUser: AppUser | null;
  setDbUser: (user: AppUser | null) => void;
  profiles: AppUser[];
  setProfiles: (profiles: AppUser[]) => void;
  matches: AppMatch[];
  setMatches: (matches: AppMatch[]) => void;
  currentMatchView: AppMatch | null;
  setCurrentMatchView: (match: AppMatch | null) => void;
  loading: boolean;
  refreshMatches: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

// ─── Provider ────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [dbUser, setDbUser] = useState<AppUser | null>(null);
  const [profiles, setProfiles] = useState<AppUser[]>([]);
  const [matches, setMatches] = useState<AppMatch[]>([]);
  const [currentMatchView, setCurrentMatchView] = useState<AppMatch | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load user from DB on auth status change
  useEffect(() => {
    if (!clerkLoaded) return;

    async function checkUser() {
      if (!isSignedIn) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();

        if (data.user && data.user.hasOnboarded) {
          setDbUser(data.user);
          setScreen("discover");
        } else {
          // Signed in but no DB record — check localStorage for pending onboarding
          const stored = localStorage.getItem("flock_onboarding_data");
          if (stored) {
            // Auto-save onboarding data to DB
            const onboardingData = JSON.parse(stored);
            const saveRes = await fetch("/api/users/me", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(onboardingData),
            });
            const saveData = await saveRes.json();
            if (saveData.user) {
              setDbUser(saveData.user);
              localStorage.removeItem("flock_onboarding_data");
              setScreen("discover");
            }
          } else {
            // No localStorage data either — fresh user, needs onboarding
            setScreen("onboarding");
          }
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    checkUser();
  }, [isSignedIn, clerkLoaded]);

  // Load profiles once user is on discover
  const refreshProfiles = useCallback(async () => {
    try {
      const res = await fetch("/api/users/discover");
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);
      }
    } catch (err) {
      console.error("Failed to load profiles:", err);
    }
  }, []);

  // Load matches
  const refreshMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error("Failed to load matches:", err);
    }
  }, []);

  useEffect(() => {
    if (screen === "discover" && dbUser) {
      refreshProfiles();
      refreshMatches();
    }
  }, [screen, dbUser, refreshProfiles, refreshMatches]);

  // Skip splash for signed-in onboarded users
  useEffect(() => {
    if (initialized && !loading && screen === "splash" && isSignedIn && dbUser?.hasOnboarded) {
      setScreen("discover");
    }
  }, [initialized, loading, screen, isSignedIn, dbUser]);

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        dbUser,
        setDbUser,
        profiles,
        setProfiles,
        matches,
        setMatches,
        currentMatchView,
        setCurrentMatchView,
        loading,
        refreshMatches,
        refreshProfiles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
