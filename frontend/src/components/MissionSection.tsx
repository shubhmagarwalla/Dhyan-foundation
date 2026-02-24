import React from "react";

interface MissionCard {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  accentColor: string;
}

const cards: MissionCard[] = [
  {
    emoji: "🐄",
    title: "Rescue",
    subtitle: "On-ground intervention",
    description:
      "Our teams operate 24/7 across Assam to stop illegal cow slaughter. We intercept transport trucks, coordinate with local authorities, and rescue cows from immediate danger.",
    highlights: [
      "24/7 rescue hotline",
      "Coordination with police",
      "Interstate truck interceptions",
    ],
    accentColor: "#FF6B00",
  },
  {
    emoji: "🏠",
    title: "Shelter",
    subtitle: "Safe gaushala in Assam",
    description:
      "Our primary gaushala in Goalpara, Assam safely houses 1,560+ cows. The facility provides clean shelter, nutritious food, and a peaceful environment for rescued cows to recover.",
    highlights: [
      "Goalpara Gaushala, Assam",
      "1,560+ cows sheltered",
      "10+ gaushala network",
    ],
    accentColor: "#2D6A4F",
  },
  {
    emoji: "💚",
    title: "Care & Feed",
    subtitle: "Daily welfare & treatment",
    description:
      "Every cow receives daily feeding, veterinary care, and Nandi-specific treatment. We ensure permanent residents live out their natural lives with dignity and love.",
    highlights: [
      "Resident veterinary doctor",
      "Daily nutritious feed",
      "Special Nandi care program",
    ],
    accentColor: "#FF8C00",
  },
];

export default function MissionSection() {
  return (
    <section
      id="about"
      className="py-24 px-6"
      style={{ background: "#fffdf8" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#fff3e0", color: "#FF6B00" }}
          >
            Our Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-5">
            What We{" "}
            <span style={{ color: "#FF6B00" }}>Do</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Dhyan Foundation Guwahati operates across three pillars of Gau Seva
            — rescue, shelter, and lifelong care for every cow in our charge.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 hover:-translate-y-2"
              style={{
                borderTop: `4px solid ${card.accentColor}`,
              }}
            >
              {/* Top decorative band */}
              <div
                className="h-2 w-full"
                style={{ background: card.accentColor }}
              />

              <div className="p-8">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm"
                  style={{ background: `${card.accentColor}15` }}
                >
                  {card.emoji}
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-extrabold mb-1"
                  style={{ color: card.accentColor }}
                >
                  {card.title}
                </h3>
                <p className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-widest">
                  {card.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {card.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: card.accentColor }}
                      >
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                style={{ background: card.accentColor }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="mt-16 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background:
              "linear-gradient(135deg, #fff3e0 0%, #e8f5ee 100%)",
            border: "1px solid #FFD9B0",
          }}
        >
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">
              Join Our Gau Seva Mission
            </h3>
            <p className="text-gray-500 max-w-lg">
              Whether you volunteer, donate, or spread the word — every act of
              Gau Seva makes a difference. Together we protect Gau Mata.
            </p>
          </div>
          <a
            href="/donate"
            className="flex-shrink-0 px-8 py-4 rounded-full font-bold text-white text-lg shadow-lg hover:scale-105 transition-transform duration-200"
            style={{ background: "#FF6B00" }}
          >
            Donate Now
          </a>
        </div>
      </div>
    </section>
  );
}
