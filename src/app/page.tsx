"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "@/lib/app-state";
import SplashScreen from "@/components/screens/SplashScreen";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import type { OnboardingResult } from "@/components/screens/OnboardingScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import DiscoverScreen from "@/components/screens/DiscoverScreen";
import MatchScreen from "@/components/screens/MatchScreen";
import MessagesScreen from "@/components/screens/MessagesScreen";
import ConservationScreen from "@/components/screens/ConservationScreen";

function AppContent() {
  const {
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
    hasOnboarded,
    setHasOnboarded,
  } = useApp();

  const handleOnboardingComplete = (data: OnboardingResult) => {
    setUser({
      ...user,
      birthCountry: data.birthCountry,
      grewUp: data.grewUp,
      recentMigrations: data.recentMigrations,
      futurePlans: data.futurePlans,
      flexibility: data.flexibility,
      lookingFor: data.lookingFor,
    });
    setHasOnboarded(true);
    setScreen("discover");
  };

  const handleSupportTogether = (amount: number) => {
    if (currentMatchView) {
      contributeToMatch(currentMatchView.user.id, amount);
    }
    setScreen("discover");
    setCurrentMatchView(null);
  };

  const handleJustSayHello = () => {
    setScreen("messages");
    setCurrentMatchView(null);
  };

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
              onContinue={() => setScreen(hasOnboarded ? "discover" : "onboarding")}
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
              currentUser={user}
              onMatch={addMatch}
              onOpenProfile={() => setScreen("profile")}
              onOpenMessages={() => setScreen("messages")}
              onOpenConservation={() => setScreen("conservation")}
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
            <ProfileScreen user={user} onBack={() => setScreen("discover")} />
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
              currentUser={user}
              onSupportTogether={handleSupportTogether}
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
              matches={matches}
              currentUser={user}
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
              matches={matches}
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
