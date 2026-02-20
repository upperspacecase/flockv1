"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { AppProvider, useApp } from "@/lib/app-state";
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

  // Check if user needs profile creation (has name + at least 1 photo)
  const isProfileComplete = !!(dbUser?.name && dbUser.photos?.length > 0);

  // Handle onboarding completion
  const handleOnboardingComplete = async (data: OnboardingResult) => {
    // Save to localStorage for persistence across auth
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));

    if (isSignedIn) {
      // Already signed in — save to DB directly
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
      // Not signed in — switch to auth screen
      // After sign-in, app-state will detect localStorage data and auto-save
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

  // Loading state
  if (loading && screen !== "splash" && screen !== "onboarding") {
    return (
      <div className="max-w-md mx-auto h-screen-safe flex items-center justify-center bg-[#fefefe]">
        <BreathingLoader />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen-safe relative overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <motion.div
            key="splash"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SplashScreen
              onContinue={() => setScreen("onboarding")}
            />
          </motion.div>
        )}

        {screen === "onboarding" && (
          <motion.div
            key="onboarding"
            className="absolute inset-0"
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
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-screen-safe flex flex-col items-center justify-center bg-[#fefefe] relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-sm">
                <h2
                  className="text-3xl font-light tracking-wide text-[#1a1a1a] mb-3"
                  style={{
                    fontFamily: "Georgia, Cambria, serif",
                  }}
                >
                  Your map is ready.
                </h2>
                <p className="text-sm text-[#888] mb-10 leading-relaxed">
                  Sign in to save your migration and find your flock.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <SignUpButton>
                    <button className="w-full px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white text-sm tracking-widest uppercase hover:bg-[#333] transition-all cursor-pointer">
                      Create Account
                    </button>
                  </SignUpButton>
                  <SignInButton>
                    <button className="w-full px-8 py-3.5 rounded-full border border-[#1a1a1a] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#1a1a1a] hover:text-white transition-all cursor-pointer">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {screen === "discover" && (
          <motion.div
            key="discover"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DiscoverScreen
              profiles={profiles}
              currentUser={dbUser}
              onOpenProfile={() => setScreen("profile")}
              onOpenMessages={() => {
                markActivitySeen();
                setScreen("messages");
              }}
              onOpenConservation={() => setScreen("conservation")}
              onOpenFlock={() => {
                markActivitySeen();
                setScreen("flock");
              }}
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
              hasNewActivity={hasNewActivity}
            />
          </motion.div>
        )}

        {screen === "profile" && (
          <motion.div
            key="profile"
            className="absolute inset-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProfileScreen
              user={dbUser}
              onBack={() => setScreen("discover")}
              onUpdate={(updatedUser) => setDbUser(updatedUser)}
            />
          </motion.div>
        )}

        {screen === "match" && currentMatchView && (
          <motion.div
            key="match"
            className="absolute inset-0"
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

        {screen === "messages" && (
          <motion.div
            key="messages"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <MessagesScreen
              onBack={() => setScreen("discover")}
            />
          </motion.div>
        )}

        {screen === "conservation" && (
          <motion.div
            key="conservation"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ConservationScreen
              onBack={() => setScreen("discover")}
            />
          </motion.div>
        )}

        {screen === "create-profile" && (
          <motion.div
            key="create-profile"
            className="absolute inset-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProfileCreationScreen
              user={dbUser}
              onComplete={async (data) => {
                try {
                  const res = await fetch("/api/users/me", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                  });
                  const result = await res.json();
                  if (result.user) setDbUser(result.user);
                } catch (err) {
                  console.error("Failed to save profile:", err);
                }

                // Resume the pending like
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

        {screen === "flock" && (
          <motion.div
            key="flock"
            className="absolute inset-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <FlockScreen
              onBack={() => setScreen("discover")}
              onOpenChat={() => setScreen("messages")}
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
