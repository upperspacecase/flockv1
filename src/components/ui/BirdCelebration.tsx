"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Bird celebration animation that plays when two users match.
 * Shows a flock of birds flying across the screen with particle effects.
 */
export default function BirdCelebration() {
    const birds = useMemo(
        () =>
            Array.from({ length: 12 }).map((_, i) => ({
                id: i,
                startX: -60 + Math.random() * 40,
                startY: 30 + Math.random() * 40,
                endX: 110 + Math.random() * 20,
                endY: 10 + Math.random() * 30,
                size: 16 + Math.random() * 14,
                delay: i * 0.12 + Math.random() * 0.3,
                duration: 2 + Math.random() * 1.2,
                wobble: 8 + Math.random() * 15,
                emoji:
                    i % 4 === 0
                        ? "🕊️"
                        : i % 4 === 1
                            ? "🐦"
                            : i % 4 === 2
                                ? "🐦‍⬛"
                                : "🪶",
            })),
        []
    );

    const feathers = useMemo(
        () =>
            Array.from({ length: 8 }).map((_, i) => ({
                id: i,
                x: 20 + Math.random() * 60,
                startY: 20 + Math.random() * 30,
                delay: 0.5 + i * 0.15,
                duration: 2.5 + Math.random() * 1.5,
                rotate: Math.random() * 360,
                scale: 0.6 + Math.random() * 0.5,
            })),
        []
    );

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {/* Flying birds */}
            {birds.map((bird) => (
                <motion.div
                    key={bird.id}
                    className="absolute"
                    style={{
                        fontSize: bird.size,
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
                    {bird.emoji}
                </motion.div>
            ))}

            {/* Floating feathers */}
            {feathers.map((f) => (
                <motion.div
                    key={`feather-${f.id}`}
                    className="absolute text-xl"
                    style={{
                        left: `${f.x}%`,
                        top: `${f.startY}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                        opacity: [0, 0.7, 0.5, 0],
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
                    🪶
                </motion.div>
            ))}

            {/* Central burst glow */}
            <motion.div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(200,133,76,0.3) 0%, rgba(200,133,76,0) 70%)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                    opacity: [0, 0.8, 0.4, 0],
                    scale: [0.3, 1.5, 2, 2.5],
                }}
                transition={{ duration: 2.5, ease: "easeOut" }}
            />
        </div>
    );
}
