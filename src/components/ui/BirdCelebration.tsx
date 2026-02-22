"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Seeded PRNG for deterministic rendering
function seededRandom(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

/**
 * Bird celebration animation that plays when two users match.
 * Shows a flock of abstract V-shapes flying across the screen.
 */
export default function BirdCelebration() {
    const birds = useMemo(() => {
        const rand = seededRandom(42);
        return Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            startX: -60 + rand() * 40,
            startY: 30 + rand() * 40,
            endX: 110 + rand() * 20,
            endY: 10 + rand() * 30,
            size: 16 + rand() * 14,
            delay: i * 0.12 + rand() * 0.3,
            duration: 2 + rand() * 1.2,
            wobble: 8 + rand() * 15,
        }));
    }, []);

    const feathers = useMemo(() => {
        const rand = seededRandom(99);
        return Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: 20 + rand() * 60,
            startY: 20 + rand() * 30,
            delay: 0.5 + i * 0.15,
            duration: 2.5 + rand() * 1.5,
            rotate: rand() * 360,
            scale: 0.6 + rand() * 0.5,
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {/* Flying birds — SVG v-shapes */}
            {birds.map((bird) => (
                <motion.div
                    key={bird.id}
                    className="absolute"
                    style={{
                        left: `${bird.startX}%`,
                        top: `${bird.startY}%`,
                    }}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0.8, 0],
                        x: `${bird.endX - bird.startX}vw`,
                        y: [
                            0,
                            -bird.wobble,
                            bird.wobble * 0.5,
                            -bird.wobble * 0.8,
                            `${bird.endY - bird.startY}vh`,
                        ],
                    }}
                    transition={{
                        duration: bird.duration,
                        delay: bird.delay,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    <svg
                        width={bird.size}
                        height={bird.size * 0.5}
                        viewBox="0 0 24 12"
                        fill="none"
                        stroke="#c8a84e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    >
                        <path d="M1 10 Q6 2 12 6 Q18 2 23 10" />
                    </svg>
                </motion.div>
            ))}

            {/* Floating lines */}
            {feathers.map((f) => (
                <motion.div
                    key={`feather-${f.id}`}
                    className="absolute"
                    style={{
                        left: `${f.x}%`,
                        top: `${f.startY}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 0.4, 0.2, 0],
                        scale: [0, f.scale, f.scale * 0.8, 0],
                        rotate: [0, f.rotate, f.rotate + 180],
                        y: [0, 60, 120],
                    }}
                    transition={{
                        duration: f.duration,
                        delay: f.delay,
                        ease: "easeOut",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8a84e" strokeWidth="1" strokeLinecap="round">
                        <path d="M3 13 Q8 1 13 5" />
                    </svg>
                </motion.div>
            ))}

            {/* Central burst — subtle on white */}
            <motion.div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                    opacity: [0, 0.6, 0.3, 0],
                    scale: [0.3, 1.5, 2, 2.5],
                }}
                transition={{ duration: 2.5, ease: "easeOut" }}
            />
        </div>
    );
}
