"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #FF6B00 0%, #FF8C00 30%, #4a9e6b 70%, #2D6A4F 100%)",
        }}
      />

      {/* Subtle overlay pattern */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 blur-3xl z-0"
        style={{ background: "#fff3e0" }}
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl z-0"
        style={{ background: "#a8d5ba" }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-5 py-2 mb-8 text-sm font-medium"
        >
          <span className="text-lg">🐄</span>
          <span>Gau Seva Since 2004 · Registered NGO · Assam</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg"
        >
          Protecting{" "}
          <span
            className="relative inline-block"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Gau Mata
          </span>
          <br />
          Across Assam
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          Dhyan Foundation Guwahati rescues cows from illegal slaughter, operates
          a gaushala, and cares for Nandis across Assam.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/donate"
            className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-orange-300/50"
            style={{ background: "#FF6B00", color: "white" }}
          >
            <span>Donate Now</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-green-800 transition-all duration-300 hover:scale-105"
          >
            <span>Our Mission</span>
          </Link>
        </motion.div>

        {/* Floating Stats Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-2xl px-8 py-4 shadow-xl"
        >
          <div className="text-4xl">🐄</div>
          <div className="text-left">
            <div className="text-3xl font-extrabold tracking-tight">1,500+</div>
            <div className="text-white/80 text-sm font-medium">Cows Rescued &amp; Protected</div>
          </div>
        </motion.div>
      </div>

      {/* 80G Badge — bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <div
          className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-white/70 shadow-xl text-white text-center"
          style={{ background: "rgba(45, 106, 79, 0.85)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-xs font-semibold leading-tight">80G</span>
          <span className="text-xs font-semibold leading-tight">Tax</span>
          <span className="text-xs font-semibold leading-tight">Benefit</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 text-xs"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
