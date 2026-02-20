"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SignInButton } from "@clerk/nextjs";
import MigrationLines from "@/components/ui/MigrationLines";

interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCTA(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen-safe relative overflow-hidden flex flex-col items-center justify-center bg-[#1a1410]">
      {/* Animated migration lines background */}
      <MigrationLines count={16} className="opacity-60" />

      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(200, 133, 76, 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* App name */}
        <motion.h1
          className="text-4xl md:text-5xl font-[var(--font-cormorant)] font-light tracking-wide text-[#faf6f1]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Migratory Species
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="mt-4 text-lg text-[#e8ddd1]/70 tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          Find your flock.
        </motion.p>

        {/* CTA */}
        <AnimatePresence>
          {showCTA && (
            <motion.button
              onClick={onContinue}
              className="mt-12 px-8 py-3 rounded-full border border-[#e8ddd1]/20 text-[#e8ddd1] text-sm tracking-widest uppercase hover:bg-[#e8ddd1]/10 transition-colors cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              Begin
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Login for returning users */}
      <motion.div
        className="absolute bottom-10 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <SignInButton>
          <button className="text-[#e8ddd1]/30 text-xs tracking-widest uppercase hover:text-[#e8ddd1]/60 transition-colors cursor-pointer">
            Login
          </button>
        </SignInButton>
      </motion.div>

      {/* Bottom subtle gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1410] to-transparent pointer-events-none" />
    </div>
  );
}
