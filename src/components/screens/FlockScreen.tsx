"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useApp, type AppMatch } from "@/lib/app-state";

interface FlockScreenProps {
    onBack: () => void;
    onOpenChat: (match: AppMatch) => void;
}

export default function FlockScreen({ onBack, onOpenChat }: FlockScreenProps) {
    const { matches, refreshMatches } = useApp();

    useEffect(() => {
        refreshMatches();
    }, [refreshMatches]);

    return (
        <div className="h-screen-safe overflow-y-auto bg-[#fefefe]">
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#fefefe]/80 backdrop-blur-md border-b border-[#e0e0e0]">
                <button
                    onClick={onBack}
                    className="text-[#999] text-sm hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                    ← Back
                </button>
                <h1
                    className="text-lg font-light tracking-wide"
                    style={{ fontFamily: "Georgia, Cambria, serif" }}
                >
                    Your Flock
                </h1>
                <div className="w-12" />
            </div>

            <div className="px-4 py-4">
                {matches.length === 0 ? (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-sm mb-4 text-[#999]/30 tracking-[0.3em] uppercase">· · ·</div>
                        <p className="text-sm text-[#999] leading-relaxed max-w-[250px] mx-auto">
                            Your flock is still forming. Keep discovering to find your people.
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {matches.map((match, i) => {
                            const other = match.otherUser || match.userB;
                            return (
                                <motion.button
                                    key={match._id}
                                    onClick={() => onOpenChat(match)}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#e0e0e0] hover:bg-[#f8f8f8] transition-colors cursor-pointer text-left"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                >
                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-full bg-[#f0f0f0] border border-[#e0e0e0] flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {other.photos?.[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={other.photos[0]}
                                                alt={other.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl">
                                                {other.name?.[0] || "?"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#1a1a1a] font-medium text-sm">
                                            {other.name || "Anonymous"}
                                        </p>
                                        <p className="text-[#888] text-xs mt-0.5">
                                            {other.currentLocation?.country || "Somewhere"}
                                        </p>
                                        <p className="text-[#bbb] text-xs mt-1">
                                            {match.species.name} ·{" "}
                                            {match.compatibilityScore}% match
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <span className="text-[#ccc] text-sm">→</span>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
