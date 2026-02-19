"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MergedMigrationMap from "@/components/maps/MergedMigrationMap";
import type { Match } from "@/lib/app-state";
import type { UserProfile, MigrationStop } from "@/data/mock-profiles";

interface MessagesScreenProps {
  matches: Match[];
  currentUser: UserProfile;
  onBack: () => void;
}

interface ChatScreenProps {
  match: Match;
  currentUser: UserProfile;
  onBack: () => void;
}

function getAllStops(user: UserProfile): MigrationStop[] {
  return [user.birthCountry, ...user.grewUp, ...user.recentMigrations, ...user.futurePlans];
}

function findOverlapHint(a: UserProfile, b: UserProfile): string | null {
  const futureA = new Set(a.futurePlans.map((s) => s.country));
  const futureB = b.futurePlans.map((s) => s.country);
  const shared = futureB.filter((c) => futureA.has(c));
  if (shared.length > 0) {
    return `You'll both be heading to ${shared[0]}. That could be interesting.`;
  }
  const recentA = new Set(a.recentMigrations.map((s) => s.country));
  const recentB = b.recentMigrations.map((s) => s.country);
  const sharedRecent = recentB.filter((c) => recentA.has(c));
  if (sharedRecent.length > 0) {
    return `You've both spent time in ${sharedRecent[0]}. Plenty to talk about.`;
  }
  return null;
}

function ChatScreen({ match, currentUser, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<{ text: string; fromSelf: boolean }[]>([]);
  const [input, setInput] = useState("");

  const hint = findOverlapHint(currentUser, match.user);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { text: input.trim(), fromSelf: true }]);
    setInput("");
  };

  const stopsA = getAllStops(currentUser);
  const stopsB = getAllStops(match.user);

  return (
    <div className="h-screen-safe flex flex-col bg-background">
      {/* Header with merged map */}
      <div className="border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
          >
            ←
          </button>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
            {match.user.name[0]}
          </div>
          <span className="text-sm font-medium">{match.user.name}</span>
        </div>
        <div className="px-4 pb-3 opacity-40">
          <MergedMigrationMap stopsA={stopsA} stopsB={stopsB} width={300} height={60} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && hint && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground/60 italic leading-relaxed max-w-[260px] mx-auto">
              {hint}
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.fromSelf
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Say something..."
            className="flex-1 px-4 py-2.5 bg-muted/50 border border-border/40 rounded-full text-sm focus:outline-none focus:border-accent/40 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-4 py-2.5 rounded-full text-sm transition-colors cursor-pointer ${
              input.trim()
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesScreen({
  matches,
  currentUser,
  onBack,
}: MessagesScreenProps) {
  const [activeChat, setActiveChat] = useState<Match | null>(null);

  if (activeChat) {
    return (
      <ChatScreen
        match={activeChat}
        currentUser={currentUser}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  return (
    <div className="h-screen-safe flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <button
          onClick={onBack}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <h1
          className="text-lg font-light tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Messages
        </h1>
        <div className="w-12" />
      </div>

      {/* Match list */}
      <div className="flex-1 overflow-y-auto">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <p
              className="text-xl font-light text-muted-foreground mb-2"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              No conversations yet.
            </p>
            <p className="text-sm text-muted-foreground/60">
              When your flocks merge, your conversations will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {matches.map((match) => (
              <motion.button
                key={match.user.id}
                onClick={() => setActiveChat(match)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted/30 transition-colors text-left cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <span className="text-lg">{match.user.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{match.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {match.user.currentLocation.country} · {match.species.name}{" "}
                    {match.species.imageEmoji}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground/40">
                  {new Date(match.matchedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
