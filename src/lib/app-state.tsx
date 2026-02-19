"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { UserProfile, currentUser, mockProfiles } from "@/data/mock-profiles";
import { MigratorySpecies, migratorySpecies } from "@/data/species";
import type { MigrationStop } from "@/data/mock-profiles";

export type AppScreen =
  | "splash"
  | "onboarding"
  | "discover"
  | "profile"
  | "messages"
  | "conservation"
  | "match";

export interface Match {
  user: UserProfile;
  species: MigratorySpecies;
  contributedAmount?: number;
  matchedAt: string;
}

export interface OnboardingData {
  birthCountry?: MigrationStop;
  grewUp: MigrationStop[];
  recentMigrations: MigrationStop[];
  futurePlans: MigrationStop[];
  flexibility: number;
  lookingFor: "romantic" | "friends" | "both";
}

interface AppState {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  profiles: UserProfile[];
  matches: Match[];
  addMatch: (profile: UserProfile) => void;
  contributeToMatch: (matchUserId: string, amount: number) => void;
  currentMatchView: Match | null;
  setCurrentMatchView: (match: Match | null) => void;
  onboardingData: OnboardingData;
  setOnboardingData: (data: OnboardingData) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (val: boolean) => void;
  currentChatMatch: Match | null;
  setCurrentChatMatch: (match: Match | null) => void;
}

const AppContext = createContext<AppState | null>(null);

function pickSpeciesForMatch(profile: UserProfile): MigratorySpecies {
  const allCountries = [
    ...profile.recentMigrations.map((s) => s.country),
    ...profile.futurePlans.map((s) => s.country),
  ];

  const hasAsia = allCountries.some((c) =>
    ["Thailand", "Vietnam", "Indonesia", "Japan", "South Korea", "Malaysia", "Philippines", "Cambodia"].includes(c)
  );
  const hasEurope = allCountries.some((c) =>
    ["Portugal", "Spain", "France", "Germany", "Netherlands", "United Kingdom", "Sweden", "Norway", "Italy"].includes(c)
  );
  const hasAfrica = allCountries.some((c) =>
    ["Kenya", "Morocco", "South Africa", "Egypt"].includes(c)
  );
  const hasOceania = allCountries.some((c) =>
    ["New Zealand", "Australia"].includes(c)
  );

  if (hasOceania) return migratorySpecies.find((s) => s.id === "bar-tailed-godwit")!;
  if (hasAfrica) return migratorySpecies.find((s) => s.id === "wildebeest")!;
  if (hasEurope) return migratorySpecies.find((s) => s.id === "european-turtle-dove")!;
  if (hasAsia) return migratorySpecies.find((s) => s.id === "humpback-whale")!;
  return migratorySpecies.find((s) => s.id === "monarch-butterfly")!;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>("splash");
  const [user, setUser] = useState<UserProfile>(currentUser);
  const [profiles] = useState<UserProfile[]>(mockProfiles);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchView, setCurrentMatchView] = useState<Match | null>(null);
  const [currentChatMatch, setCurrentChatMatch] = useState<Match | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    grewUp: [],
    recentMigrations: [],
    futurePlans: [],
    flexibility: 0.5,
    lookingFor: "both",
  });
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const addMatch = useCallback(
    (profile: UserProfile) => {
      const species = pickSpeciesForMatch(profile);
      const newMatch: Match = {
        user: profile,
        species,
        matchedAt: new Date().toISOString(),
      };
      setMatches((prev) => [...prev, newMatch]);
      setCurrentMatchView(newMatch);
      setScreen("match");
    },
    []
  );

  const contributeToMatch = useCallback(
    (matchUserId: string, amount: number) => {
      setMatches((prev) =>
        prev.map((m) =>
          m.user.id === matchUserId ? { ...m, contributedAmount: amount } : m
        )
      );
    },
    []
  );

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        user,
        setUser,
        profiles,
        matches,
        addMatch,
        contributeToMatch,
        currentMatchView,
        setCurrentMatchView,
        onboardingData,
        setOnboardingData,
        hasOnboarded,
        setHasOnboarded,
        currentChatMatch,
        setCurrentChatMatch,
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
