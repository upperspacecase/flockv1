"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import type { AppUser } from "@/lib/app-state";

interface ProfileCreationScreenProps {
    user: AppUser | null;
    onComplete: (data: { name: string; lastTuesday: string; photos: string[] }) => void;
    onSkip: () => void;
}

export default function ProfileCreationScreen({
    user,
    onComplete,
    onSkip,
}: ProfileCreationScreenProps) {
    const [name, setName] = useState(user?.name || "");
    const [lastTuesday, setLastTuesday] = useState(user?.lastTuesday || "");
    const [photos, setPhotos] = useState<string[]>(user?.photos || []);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const canComplete = name.trim().length >= 2 && photos.length > 0;

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || photos.length >= 2) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/avatar", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                setPhotos((prev) => [...prev, data.url]);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!canComplete) return;
        setSaving(true);
        onComplete({ name: name.trim(), lastTuesday: lastTuesday.trim(), photos });
    };

    return (
        <div className="h-screen-safe overflow-y-auto bg-[#f4efe7]">
            <div className="min-h-full flex flex-col px-6 py-12">
                {/* Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1
                        className="text-3xl font-light text-[#1a1a1a] mb-2"
                        style={{ fontFamily: "Georgia, Cambria, serif" }}
                    >
                        Create your profile
                    </h1>
                    <p className="text-sm text-[#8a7e6d]">
                        Let your flock know who you are.
                    </p>
                </motion.div>

                {/* Photos */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <label className="text-xs text-[#8a7e6d] uppercase tracking-wider block mb-3">
                        Photos ({photos.length}/2)
                    </label>
                    <div className="flex gap-3">
                        <AnimatePresence mode="popLayout">
                            {photos.map((url, i) => (
                                <motion.div
                                    key={url}
                                    className="relative w-36 h-44 rounded-xl overflow-hidden border border-[#ddd5c8]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={url}
                                        alt={`Photo ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#faf7f2]/80 flex items-center justify-center text-xs text-[#1a1a1a] hover:bg-white transition-colors cursor-pointer"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {photos.length < 2 && (
                            <motion.button
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                                className="w-36 h-44 rounded-xl border-2 border-dashed border-[#ddd5c8] flex flex-col items-center justify-center text-[#b5aa98] hover:border-[#8a7e6d] hover:text-[#8a7e6d] transition-colors cursor-pointer"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {uploading ? (
                                    <span className="text-sm">Uploading...</span>
                                ) : (
                                    <>
                                        <span className="text-2xl mb-1">+</span>
                                        <span className="text-xs">Add photo</span>
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                    />
                </motion.div>

                {/* Name */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <label className="text-xs text-[#8a7e6d] uppercase tracking-wider block mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="What should your flock call you?"
                        className="w-full px-4 py-3 bg-[#ece7dd] border border-[#ddd5c8] rounded-xl text-[#1a1a1a] placeholder:text-[#b5aa98] focus:outline-none focus:border-[#c8a84e] transition-colors"
                    />
                </motion.div>

                {/* Bio */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <label className="text-xs text-[#8a7e6d] uppercase tracking-wider block mb-2">
                        What did last Tuesday look like? <span className="text-[#b5aa98]">(optional)</span>
                    </label>
                    <textarea
                        value={lastTuesday}
                        onChange={(e) => setLastTuesday(e.target.value)}
                        placeholder="Coffee in Lisbon, worked from a rooftop, got lost looking for dinner..."
                        rows={3}
                        className="w-full px-4 py-3 bg-[#ece7dd] border border-[#ddd5c8] rounded-xl text-[#1a1a1a] placeholder:text-[#b5aa98] focus:outline-none focus:border-[#c8a84e] transition-colors resize-none"
                    />
                </motion.div>

                {/* Actions */}
                <motion.div
                    className="mt-auto space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <button
                        onClick={handleSave}
                        disabled={!canComplete || saving}
                        className={`w-full py-3.5 rounded-full text-sm tracking-widest uppercase transition-all cursor-pointer ${canComplete
                                ? "bg-[#c8a84e] text-[#1a1a1a] hover:bg-[#b89940]"
                                : "bg-[#ece7dd] text-[#b5aa98] cursor-not-allowed"
                            }`}
                    >
                        {saving ? "Saving..." : "Save & continue"}
                    </button>
                    <button
                        onClick={onSkip}
                        className="w-full text-center text-sm text-[#a09585] hover:text-[#1a1a1a] transition-colors cursor-pointer py-2"
                    >
                        Skip for now
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
