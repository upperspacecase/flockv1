"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { AppProvider, useApp } from "@/lib/app-state";
import SplashScreen from "@/components/screens/SplashScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import type { OnboardingResult } from "@/components/screens/OnboardingScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import DiscoverScreen from "@/components/screens/DiscoverScreen";
import MatchScreen from "@/components/screens/MatchScreen";
import MessagesScreen from "@/components/screens/MessagesScreen";
import ConservationScreen from "@/components/screens/ConservationScreen";
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
    refreshMatches,
    refreshProfiles,
  } = useApp();

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
      <div className="max-w-md mx-auto h-screen-safe flex items-center justify-center bg-[#1a1410]">
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
            <div className="h-screen-safe flex flex-col items-center justify-center bg-[#1a1410] relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, rgba(200, 133, 76, 0.08) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center px-8 text-center max-w-sm">
                <h2
                  className="text-3xl font-light tracking-wide text-[#faf6f1] mb-3"
                  style={{
                    fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
                  }}
                >
                  Your map is ready.
                </h2>
                <p className="text-sm text-[#e8ddd1]/60 mb-10 leading-relaxed">
                  Sign in to save your migration and find your flock.
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <SignUpButton>
                    <button className="w-full px-8 py-3.5 rounded-full bg-[#c8854c] text-[#faf6f1] text-sm tracking-widest uppercase hover:bg-[#b5763f] transition-all cursor-pointer shadow-lg shadow-[#c8854c]/20">
                      Create Account
                    </button>
                  </SignUpButton>
                  <SignInButton>
                    <button className="w-full px-8 py-3.5 rounded-full border border-[#e8ddd1]/20 text-[#e8ddd1] text-sm tracking-widest uppercase hover:bg-[#e8ddd1]/5 transition-all cursor-pointer">
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
              onOpenMessages={() => setScreen("messages")}
              onOpenConservation={() => setScreen("conservation")}
              onMatch={(match) => {
                setCurrentMatchView(match);
                setScreen("match");
              }}
              onRefreshProfiles={refreshProfiles}
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
