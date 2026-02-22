"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { countries, type Country } from "@/data/countries";
import MigrationMap from "@/components/maps/MigrationMap";
import type { MigrationStop } from "@/lib/app-state";

interface OnboardingScreenProps {
  onComplete: (data: OnboardingResult) => void;
}

export interface OnboardingResult {
  birthCountry: MigrationStop;
  grewUp: MigrationStop[];
  recentMigrations: MigrationStop[];
  futurePlans: MigrationStop[];
  currentLocation: MigrationStop;
  flexibility: number;
  lookingFor: "romantic" | "friends" | "both";
}

function countryToStop(c: Country): MigrationStop {
  return { country: c.name, countryCode: c.code, lat: c.lat, lng: c.lng };
}

const bgColors = [
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
  "from-[#fefefe] to-[#f5f5f5]",
];

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [birthCountry, setBirthCountry] = useState<Country | null>(null);
  const [grewUp, setGrewUp] = useState<Country[]>([]);
  const [recent, setRecent] = useState<Country[]>([]);
  const [future, setFuture] = useState<Country[]>([]);
  const [currentLoc, setCurrentLoc] = useState<Country | null>(null);
  const [flexibility, setFlexibility] = useState(0.5);
  const [lookingFor, setLookingFor] = useState<
    "romantic" | "friends" | "both"
  >("both");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return countries
      .filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 6);
  }, [searchQuery]);

  const allStops: MigrationStop[] = useMemo(() => {
    const stops: MigrationStop[] = [];
    if (birthCountry) stops.push(countryToStop(birthCountry));
    grewUp.forEach((c) => stops.push(countryToStop(c)));
    recent.forEach((c) => stops.push(countryToStop(c)));
    if (currentLoc) stops.push(countryToStop(currentLoc));
    return stops;
  }, [birthCountry, grewUp, recent, currentLoc]);

  const futureStops = useMemo(
    () => future.map((c) => countryToStop(c)),
    [future]
  );

  // steps: 0=birth, 1=grewUp, 2=recent, 3=current, 4=future, 5=flexibility, 6=lookingFor
  const canAdvance = useCallback(() => {
    switch (step) {
      case 0:
        return !!birthCountry;
      case 1:
        return grewUp.length > 0;
      case 2:
        return recent.length > 0;
      case 3:
        return !!currentLoc;
      case 4:
        return future.length > 0;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  }, [step, birthCountry, grewUp, recent, currentLoc, future]);

  const totalSteps = 7;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      setSearchQuery("");
    } else {
      onComplete({
        birthCountry: countryToStop(birthCountry!),
        grewUp: grewUp.map(countryToStop),
        recentMigrations: recent.map(countryToStop),
        futurePlans: future.map(countryToStop),
        currentLocation: countryToStop(currentLoc!),
        flexibility,
        lookingFor,
      });
    }
  };

  const handleCountrySelect = (country: Country) => {
    switch (step) {
      case 0:
        setBirthCountry(country);
        setSearchQuery("");
        break;
      case 1:
        if (!grewUp.find((c) => c.code === country.code)) {
          setGrewUp([...grewUp, country]);
        }
        setSearchQuery("");
        break;
      case 2:
        if (!recent.find((c) => c.code === country.code)) {
          setRecent([...recent, country]);
        }
        setSearchQuery("");
        break;
      case 3:
        setCurrentLoc(country);
        setSearchQuery("");
        break;
      case 4:
        if (!future.find((c) => c.code === country.code)) {
          setFuture([...future, country]);
        }
        setSearchQuery("");
        break;
    }
  };

  const removeCountry = (code: string) => {
    switch (step) {
      case 1:
        setGrewUp(grewUp.filter((c) => c.code !== code));
        break;
      case 2:
        setRecent(recent.filter((c) => c.code !== code));
        break;
      case 4:
        setFuture(future.filter((c) => c.code !== code));
        break;
    }
  };

  const questions = [
    "Where did your journey begin?",
    "Where did you grow up?",
    "Where have you been recently?",
    "Where are you right now?",
    "Where are you heading next?",
    "How flexible is your path?",
    "What kind of flock are you looking for?",
  ];

  const subtitles = [
    "Your birth country — the first pin on your map.",
    "The countries that shaped you. Add as many as you like.",
    "Your recent migrations — the last few chapters.",
    "Drop a pin where you are today.",
    "Your future path — even if it's just a dream.",
    "From rooted to wind-blown.",
    "There's no wrong answer here.",
  ];

  const isCountryStep = step >= 0 && step <= 4;

  const selectedForStep =
    step === 0
      ? birthCountry
        ? [birthCountry]
        : []
      : step === 1
        ? grewUp
        : step === 2
          ? recent
          : step === 3
            ? currentLoc
              ? [currentLoc]
              : []
            : step === 4
              ? future
              : [];

  return (
    <div
      className={`h-screen-safe relative overflow-hidden flex flex-col bg-gradient-to-b ${bgColors[step] || bgColors[0]} transition-colors duration-1000`}
    >
      {/* Migration map progress indicator */}
      {allStops.length > 0 && (
        <div className="absolute top-0 left-0 right-0 px-4 pt-4 opacity-40 z-0">
          <MigrationMap
            stops={allStops}
            futureStops={futureStops}
            width={320}
            height={80}
            compact
            animated={false}
          />
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            {/* Question */}
            <h2
              className="text-3xl font-light text-[#1a1a1a] mb-2"
              style={{
                fontFamily: "Georgia, Cambria, serif",
              }}
            >
              {questions[step]}
            </h2>
            <p className="text-sm text-[#888] mb-8">
              {subtitles[step]}
            </p>

            {/* Country search (steps 0-4) */}
            {isCountryStep && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a country..."
                  className="w-full px-4 py-3 bg-[#f8f8f8] border border-[#e0e0e0] rounded-xl text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:border-[#1a1a1a] transition-colors"
                />

                {/* Search results */}
                {filteredCountries.length > 0 && (
                  <div className="space-y-1">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleCountrySelect(c)}
                        className="w-full text-left px-4 py-2.5 rounded-lg bg-[#f5f5f5] hover:bg-[#eee] text-[#1a1a1a] text-sm transition-colors cursor-pointer"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected chips */}
                {selectedForStep.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedForStep.map((c) => (
                      <span
                        key={c.code}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f0f0] border border-[#ddd] text-[#1a1a1a] text-sm"
                      >
                        {c.name}
                        {(step === 1 || step === 2 || step === 4) && (
                          <button
                            onClick={() => removeCountry(c.code)}
                            className="hover:text-[#999] transition-colors cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Flexibility slider (step 7) */}
            {step === 5 && (
              <div className="space-y-6">
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
                  onChange={(e) =>
                    setFlexibility(parseFloat(e.target.value))
                  }
                  className="w-full accent-[#1a1a1a] h-1.5 cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #1a1a1a ${flexibility * 100}%, #e0e0e0 ${flexibility * 100}%)`,
                  }}
                />
                <div className="flex justify-center">
                  <motion.div
                    className="text-5xl"
                    animate={{
                      rotate:
                        flexibility > 0.5 ? [0, -5, 5, 0] : 0,
                      y: flexibility > 0.7 ? [0, -3, 0] : 0,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round">
                      {flexibility < 0.3 ? (
                        /* rooted — vertical line with branches */
                        <>
                          <line x1="16" y1="28" x2="16" y2="8" />
                          <line x1="16" y1="14" x2="10" y2="8" />
                          <line x1="16" y1="14" x2="22" y2="8" />
                          <line x1="16" y1="20" x2="11" y2="16" />
                          <line x1="16" y1="20" x2="21" y2="16" />
                        </>
                      ) : flexibility < 0.6 ? (
                        /* swaying — curved stem */
                        <path d="M16 28 Q14 20 16 14 Q18 8 14 4" />
                      ) : flexibility < 0.8 ? (
                        /* drifting — leaf shape */
                        <path d="M8 22 Q16 6 24 10 Q16 14 8 22Z" />
                      ) : (
                        /* wind-blown — bird in flight */
                        <>
                          <path d="M4 18 Q10 10 16 14 Q22 10 28 18" />
                          <line x1="16" y1="14" x2="16" y2="20" />
                        </>
                      )}
                    </svg>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Looking for (step 8) */}
            {step === 6 && (
              <div className="space-y-3">
                {[
                  {
                    value: "romantic" as const,
                    label: "A romantic co-migrant",
                    desc: "Two birds flying in formation",
                  },
                  {
                    value: "friends" as const,
                    label: "Fellow travelers & friends",
                    desc: "A flock, diverse and vibrant",
                  },
                  {
                    value: "both" as const,
                    label: "Both — surprise me",
                    desc: "Open to wherever the wind takes it",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLookingFor(opt.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all cursor-pointer ${lookingFor === opt.value
                      ? "bg-[#f0f0f0] border-[#1a1a1a]"
                      : "bg-white border-[#e0e0e0] hover:bg-[#f8f8f8]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[#1a1a1a] text-sm font-medium">
                          {opt.label}
                        </p>
                        <p className="text-[#888] text-xs mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="p-6 pb-8 relative z-10">
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => {
                setStep(step - 1);
                setSearchQuery("");
              }}
              className="text-[#999] text-sm hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className={`px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all cursor-pointer ${canAdvance()
              ? "bg-[#1a1a1a] text-white hover:bg-[#333]"
              : "bg-[#f0f0f0] text-[#ccc] cursor-not-allowed"
              }`}
          >
            {step === totalSteps - 1 ? "Find my flock" : "Continue"}
          </button>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i === step
                ? "w-6 bg-[#1a1a1a]"
                : i < step
                  ? "w-1.5 bg-[#1a1a1a]/40"
                  : "w-1.5 bg-[#ddd]"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
