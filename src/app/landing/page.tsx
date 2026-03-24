"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const cities = [
  {
    name: "Bali",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
  },
  {
    name: "Lisbon",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop",
  },
  {
    name: "Mexico City",
    image: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&h=400&fit=crop",
  },
  {
    name: "Berlin",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop",
  },
  {
    name: "Bangkok",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",
  },
  {
    name: "Buenos Aires",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&h=400&fit=crop",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1a1a1a] overflow-x-hidden">
      {/* ─── Header ─── */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span
          className="text-lg tracking-wide text-white"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
        >
          Migratory Species
        </span>
        <Link
          href="/sign-in"
          className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs tracking-widest uppercase hover:bg-white/30 transition-colors border border-white/20"
        >
          Log In
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="A flock of birds migrating at sunset over wetlands"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Hero content */}
        <div className="relative z-[1] flex flex-col items-center justify-end h-full px-6 pb-16 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-light leading-[1.1] text-white max-w-2xl mb-4"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Welcome to Migratory Species.
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/80 max-w-md leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Connect with people who share your migration patterns. 1,000+ migratory spirits &amp; counting.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              href="/sign-up"
              className="inline-block px-10 py-4 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase font-medium hover:bg-[#b89940] transition-colors shadow-lg"
            >
              Find Your Flock
            </Link>
            <Link
              href="/sign-in"
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              Already have an account? <span className="underline underline-offset-2">Log In</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── The Idea ─── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fade}
          custom={0}
        >
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
          >
            The Idea.
          </h2>
          <p className="text-[#8a7e6d] leading-relaxed text-lg">
            Migratory Species matches you with people who share your migration
            patterns — expats, digital nomads, third-culture kids, anyone whose
            answer to &ldquo;where are you from?&rdquo; takes five minutes. Then
            it invites you both to support a real migratory animal species
            together. Your connection becomes conservation.
          </p>
        </motion.div>
      </section>

      {/* ─── Select City ─── */}
      <section className="bg-[#ece7dd] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="flex items-center gap-3 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fade}
            custom={0}
          >
            {/* Pin icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a84e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h2
              className="text-3xl md:text-4xl font-light"
              style={{ fontFamily: "Georgia, Cambria, serif" }}
            >
              Select City
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city, i) => (
              <motion.div
                key={city.name}
                className="relative h-48 md:h-56 rounded-2xl overflow-hidden group cursor-pointer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                custom={i * 0.3}
              >
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-white text-sm font-medium tracking-wide">
                    {city.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="bg-[#1a1a1a] text-[#f4efe7] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-light mb-16"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fade}
            custom={0}
          >
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Map your migration",
                desc: "Tell us where you were born, where you grew up, where you are now, and where you're heading.",
              },
              {
                step: "02",
                title: "Find your flock",
                desc: "We match you with people whose paths cross yours — same cities, same rhythms, same restlessness.",
              },
              {
                step: "03",
                title: "Support a species",
                desc: "Every match is paired with a real migratory animal. Together you can support their journey.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fade}
                custom={i + 1}
              >
                <span className="text-[#c8a84e] text-xs tracking-widest uppercase">
                  {item.step}
                </span>
                <h3
                  className="text-xl font-light mt-3 mb-3"
                  style={{ fontFamily: "Georgia, Cambria, serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-[#a09585] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Species ─── */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fade}
            custom={0}
          >
            Migratory species, supporting migratory species.
          </motion.h2>
          <motion.p
            className="text-[#8a7e6d] max-w-xl mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            custom={1}
          >
            When you match, we pair you with a real animal that shares your
            migration route. Your connection becomes conservation.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "Arctic Tern", route: "Arctic to Antarctic", fact: "71,000 km per year" },
              { name: "Bar-tailed Godwit", route: "Alaska to New Zealand", fact: "11 days non-stop" },
              { name: "Monarch Butterfly", route: "Canada to Mexico", fact: "4 generations, one journey" },
            ].map((species, i) => (
              <motion.div
                key={species.name}
                className="bg-[#faf7f2] rounded-2xl p-6 border border-[#ddd5c8]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fade}
                custom={i + 1}
              >
                <h3
                  className="text-lg font-light mb-1"
                  style={{ fontFamily: "Georgia, Cambria, serif" }}
                >
                  {species.name}
                </h3>
                <p className="text-xs text-[#c8a84e] tracking-wider uppercase mb-3">
                  {species.route}
                </p>
                <p className="text-sm text-[#8a7e6d]">{species.fact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1400&h=600&fit=crop"
            alt="Nature landscape"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-[1] max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-light mb-6 text-white"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            custom={0}
          >
            Ready to find your flock?
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            custom={1}
          >
            <Link
              href="/sign-up"
              className="inline-block px-10 py-4 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase font-medium hover:bg-[#b89940] transition-colors shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#ddd5c8] py-8 bg-[#f4efe7]">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span
            className="text-sm text-[#8a7e6d]"
            style={{ fontFamily: "Georgia, Cambria, serif" }}
          >
            Migratory Species
          </span>
          <span className="text-xs text-[#b5aa98]">
            Connection through migration.
          </span>
        </div>
      </footer>
    </div>
  );
}
