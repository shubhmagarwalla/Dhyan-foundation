"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  target: number;
  suffix: string;
  prefix?: string;
  icon: string;
  description: string;
}

const stats: StatItem[] = [
  {
    label: "Cows Rescued",
    target: 1560,
    suffix: "+",
    icon: "🐄",
    description: "Saved from slaughter & neglect",
  },
  {
    label: "Years Active",
    target: 20,
    suffix: "+",
    icon: "📅",
    description: "Dedicated service since 2004",
  },
  {
    label: "Gaushalas",
    target: 10,
    suffix: "+",
    icon: "🏠",
    description: "Safe shelters across Assam",
  },
  {
    label: "Donors",
    target: 5000,
    suffix: "+",
    icon: "💚",
    description: "Supporters from across India",
  },
];

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, target, duration]);

  return count;
}

function StatCard({ stat, isVisible }: { stat: StatItem; isVisible: boolean }) {
  const count = useCountUp(stat.target, isVisible, 2000);

  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden">
      {/* Decorative background circle */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ background: "#FF6B00" }}
      />

      {/* Icon */}
      <div className="text-4xl mb-3">{stat.icon}</div>

      {/* Number */}
      <div
        className="text-5xl font-extrabold mb-1 tabular-nums"
        style={{ color: "#FF6B00" }}
      >
        {stat.target >= 1000
          ? count >= 1000
            ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`
            : count
          : count}
        {stat.suffix}
      </div>

      {/* Label */}
      <div
        className="text-lg font-bold mb-1"
        style={{ color: "#2D6A4F" }}
      >
        {stat.label}
      </div>

      {/* Description */}
      <div className="text-gray-500 text-sm">{stat.description}</div>
    </div>
  );
}

export default function ImpactCounter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#fff3e0", color: "#FF6B00" }}
          >
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Numbers That{" "}
            <span style={{ color: "#2D6A4F" }}>Matter</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Two decades of dedicated Gau Seva in Assam — every number represents
            a life saved.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          * Numbers updated regularly. Data as of 2026.
        </div>
      </div>
    </section>
  );
}
