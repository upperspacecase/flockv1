"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1a1a1a] overflow-x-hidden">
      {/* ─── Nav ─── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span
          className="text-lg tracking-wide"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
        >
          Migratory Species
        </span>
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-xs tracking-widest uppercase hover:bg-[#b89940] transition-colors"
        >
          Open App
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24">
        <motion.h1
          className="text-5xl md:text-7xl font-light leading-[1.1] max-w-3xl"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Connection for people who move through the world.
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-[#8a7e6d] max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Migratory Species matches you with people who share your migration
          patterns — then invites you both to support a real migratory animal
          species together.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#b89940] transition-colors"
          >
            Find Your Flock
          </Link>
        </motion.div>
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

      {/* ─── For whom ─── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.h2
          className="text-3xl md:text-4xl font-light mb-4"
          style={{ fontFamily: "Georgia, Cambria, serif" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fade}
          custom={0}
        >
          Built for the ones who left.
        </motion.h2>
        <motion.p
          className="text-[#8a7e6d] max-w-xl mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fade}
          custom={1}
        >
          Digital nomads, expats, third-culture kids, exchange students,
          trailing spouses, diplomats&apos; children, anyone whose answer to
          &ldquo;where are you from?&rdquo; takes five minutes.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Lisbon", "Bali", "Mexico City", "Berlin",
            "Bangkok", "Buenos Aires", "Tbilisi", "Cape Town",
          ].map((city, i) => (
            <motion.div
              key={city}
              className="bg-[#ece7dd] rounded-2xl px-4 py-6 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fade}
              custom={i * 0.5}
            >
              <span className="text-sm text-[#1a1a1a]">{city}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Species ─── */}
      <section className="bg-[#ece7dd] py-24">
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
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-light mb-6"
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
            href="/"
            className="inline-block px-10 py-4 rounded-full bg-[#c8a84e] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#b89940] transition-colors"
          >
            Get Started
          </Link>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[#ddd5c8] py-8">
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
