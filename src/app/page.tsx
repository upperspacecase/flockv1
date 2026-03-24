"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { AppProvider, useApp, type AppScreen } from "@/lib/app-state";
import SplashScreen from "@/components/screens/SplashScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import type { OnboardingResult } from "@/components/screens/OnboardingScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import ProfileCreationScreen from "@/components/screens/ProfileCreationScreen";
import DiscoverScreen from "@/components/screens/DiscoverScreen";
import MatchScreen from "@/components/screens/MatchScreen";
import MessagesScreen from "@/components/screens/MessagesScreen";
import ConservationScreen from "@/components/screens/ConservationScreen";
import FlockScreen from "@/components/screens/FlockScreen";
import BreathingLoader from "@/components/ui/BreathingLoader";

const ONBOARDING_KEY = "flock_onboarding_data";

function AppContent() {
  const { isSignedIn, isLoaded: clerkLoaded } = useUser();
  const {
    screen,
    setScreen,
    dbUser,
    setDbUser,
    profiles,
    matches,
    currentMatchView,
    setCurrentMatchView,
    loading,
    hasNewActivity,
    markActivitySeen,
    refreshMatches,
    refreshProfiles,
  } = useApp();

  const [pendingLikeId, setPendingLikeId] = useState<string | null>(null);
  const isProfileComplete = !!(dbUser?.name && dbUser.photos?.length > 0);

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: OnboardingResult) => {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));

    if (isSignedIn) {
      try {
        const res = await fetch("/api/users/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.user) {
          setDbUser(result.user);
          localStorage.removeItem(ONBOARDING_KEY);
          setScreen("discover");
        }
      } catch (err) {
        console.error("Failed to save onboarding:", err);
      }
    } else {
      setScreen("auth");
    }
  };

  // Conservation contribution handler
  const handleContribute = async (amount: number) => {
    if (!currentMatchView) return;
    try {
      await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: currentMatchView._id, amount }),
      });
      await refreshMatches();
    } catch (err) {
      console.error("Failed to contribute:", err);
    }
    setScreen("discover");
    setCurrentMatchView(null);
  };

  const handleJustSayHello = () => {
    setScreen("messages");
    setCurrentMatchView(null);
  };

  // Loading state — show loader for any screen except splash/onboarding (pre-auth screens)
  if (loading && screen !== "splash" && screen !== "onboarding" && screen !== "auth") {
    return (
      <div className="max-w-md mx-auto h-screen-safe flex items-center justify-center bg-[#f4efe7]">
        <BreathingLoader />
      </div>
    );
  }

  // Tab bar screens
  const tabScreens: AppScreen[] = ["discover", "flock", "messages", "profile"];
  const isTabScreen = tabScreens.includes(screen);

  const tabs = [
    { id: "discover" as AppScreen, label: "Discover" },
    { id: "flock" as AppScreen, label: "Flock", showDot: hasNewActivity },
    { id: "messages" as AppScreen, label: "Messages" },
    { id: "profile" as AppScreen, label: "Profile" },
  ];

  return (
    <div className="max-w-md mx-auto h-screen-safe relative overflow-hidden bg-background">
      {/* ─── Tab layout ─── */}
      {isTabScreen && (
        <div className="absolute inset-0 flex flex-col">
          {/* Tab content area */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {screen === "discover" && (
                <motion.div
                  key="discover"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DiscoverScreen
                    profiles={profiles}
                    currentUser={dbUser}
                    onMatch={(match) => {
                      setCurrentMatchView(match);
                      setScreen("match");
                    }}
                    onNeedProfile={(profileId) => {
                      setPendingLikeId(profileId);
                      setScreen("create-profile");
                    }}
                    isProfileComplete={isProfileComplete}
                    onRefreshProfiles={refreshProfiles}
                  />
                </motion.div>
              )}

              {screen === "flock" && (
                <motion.div
                  key="flock"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FlockScreen
                    onBack={() => setScreen("discover")}
                    onOpenChat={() => setScreen("messages")}
                  />
                </motion.div>
              )}

              {screen === "messages" && (
                <motion.div
                  key="messages"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessagesScreen
                    onBack={() => setScreen("discover")}
                  />
                </motion.div>
              )}

              {screen === "profile" && (
                <motion.div
                  key="profile"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProfileScreen
                    user={dbUser}
                    onBack={() => setScreen("discover")}
                    onUpdate={(updatedUser) => setDbUser(updatedUser)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom tab bar */}
          <div className="flex items-center justify-around border-t border-[#ddd5c8] bg-[#f4efe7] py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "flock") markActivitySeen();
                  setScreen(tab.id);
                }}
                className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors cursor-pointer ${screen === tab.id
                  ? "text-[#1a1a1a]"
                  : "text-[#b5aa98] hover:text-[#8a7e6d]"
                  }`}
              >
                <span className={`text-[10px] tracking-widest uppercase ${screen === tab.id ? "font-medium" : ""}`}>{tab.label}</span>
                {tab.showDot && (
                  <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Overlay screens (no tab bar) ─── */}
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div
            key="splash"
            className="absolute inset-0 z-20"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SplashScreen onContinue={() => setScreen("onboarding")} />
          </motion.div>
        )}

        {screen === "onboarding" && (
          <motion.div
            key="onboarding"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {screen === "auth" && (
          <motion.div
            key="auth"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-screen-safe flex flex-col items-center justify-center bg-[#f4efe7]">
              <div className="flex flex-col items-center px-8 text-center max-w-sm">
                <h2
                  className="text-3xl font-light tracking-wide text-[#1a1a1a] mb-3"
                  style={{ fontFamily: "Georgia, Cambria, serif" }}
                >
                  Your map is ready.
                </h2>
                <p className="text-sm text-[#8a7e6d] mb-10 leading-relaxed">
                  Sign in to save your migration and find your flock.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <SignUpButton mode="redirect">
                    <button className="w-full px-8 py-3.5 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#b89940] transition-all cursor-pointer">
                      Create Account
                    </button>
                  </SignUpButton>
                  <SignInButton mode="redirect">
                    <button className="w-full px-8 py-3.5 rounded-full border border-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#c8a84e] hover:text-[#1a1a1a] transition-all cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {screen === "match" && currentMatchView && (
          <motion.div
            key="match"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MatchScreen
              match={currentMatchView}
              currentUser={dbUser}
              onSupportTogether={handleContribute}
              onJustSayHello={handleJustSayHello}
            />
          </motion.div>
        )}

        {screen === "conservation" && (
          <motion.div
            key="conservation"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <ConservationScreen onBack={() => setScreen("discover")} />
          </motion.div>
        )}

        {screen === "create-profile" && (
          <motion.div
            key="create-profile"
            className="absolute inset-0 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <ProfileCreationScreen
              user={dbUser}
              onComplete={async (data) => {
                const res = await fetch("/api/users/me", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                if (!res.ok) {
                  throw new Error("Failed to save profile");
                }
                const result = await res.json();
                if (result.user) setDbUser(result.user);

                if (pendingLikeId) {
                  try {
                    const likeRes = await fetch("/api/likes", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ likedUserId: pendingLikeId }),
                    });
                    const likeData = await likeRes.json();
                    if (likeData.matched && likeData.match) {
                      setCurrentMatchView(likeData.match);
                      setPendingLikeId(null);
                      setScreen("match");
                      return;
                    }
                  } catch (err) {
                    console.error("Failed to like:", err);
                  }
                  setPendingLikeId(null);
                }
                setScreen("discover");
              }}
              onSkip={() => {
                setPendingLikeId(null);
                setScreen("discover");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
