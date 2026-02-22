"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import MergedMigrationMap from "@/components/maps/MergedMigrationMap";
import { useApp, type AppMatch, type MigrationStop } from "@/lib/app-state";

interface MessagesScreenProps {
  onBack: () => void;
}

interface ChatMessage {
  _id: string;
  text: string;
  senderId: string;
  fromSelf: boolean;
  createdAt: string;
}

function getAllStops(user: { birthCountry: MigrationStop; grewUp: MigrationStop[]; recentMigrations: MigrationStop[]; futurePlans: MigrationStop[] }): MigrationStop[] {
  return [user.birthCountry, ...user.grewUp, ...user.recentMigrations, ...user.futurePlans];
}

function ChatScreen({ match, onBack }: { match: AppMatch; onBack: () => void }) {
  const { dbUser } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherUser = match.otherUser || match.userB;

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?matchId=${match._id}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [match._id]);

  // Initial load + polling
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: match._id, text: input.trim() }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInput("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const stopsA = dbUser ? getAllStops(dbUser) : [];
  const stopsB = getAllStops(otherUser);

  return (
    <div className="h-screen-safe flex flex-col bg-background">
      <div className="border-b border-border/40">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors cursor-pointer"
          >
            ←
          </button>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
            {otherUser.name[0]}
          </div>
          <span className="text-sm font-medium">{otherUser.name}</span>
        </div>
        <div className="px-4 pb-3 opacity-40">
          <MergedMigrationMap stopsA={stopsA} stopsB={stopsB} width={300} height={60} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-muted-foreground/60 italic leading-relaxed max-w-[260px] mx-auto">
              You matched with {otherUser.name}. Say something!
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              className={`flex ${msg.fromSelf ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.fromSelf
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                  }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

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
            disabled={!input.trim() || sending}
            className={`px-4 py-2.5 rounded-full text-sm transition-colors cursor-pointer ${input.trim() && !sending
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

export default function MessagesScreen({ onBack }: MessagesScreenProps) {
  const { matches, refreshMatches } = useApp();
  const [activeChat, setActiveChat] = useState<AppMatch | null>(null);

  useEffect(() => {
    refreshMatches();
  }, [refreshMatches]);

  if (activeChat) {
    return <ChatScreen match={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="h-screen-safe flex flex-col bg-background">
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
            {matches.map((match) => {
              const otherUser = match.otherUser || match.userB;
              return (
                <motion.button
                  key={match._id}
                  onClick={() => setActiveChat(match)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted/30 transition-colors text-left cursor-pointer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                    <span className="text-lg">{otherUser.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{otherUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {otherUser.currentLocation?.country} · {match.species.name}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground/40">
                    {new Date(match.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
