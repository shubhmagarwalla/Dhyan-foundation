"use client";

import { useState, useMemo } from "react";
import {
  MYTHOLOGY_STORIES,
  REGIONAL_TRADITIONS,
  MYTHOLOGY_CATEGORIES,
  TRADITION_CATEGORIES,
  type MythologyStory,
  type RegionalTradition,
} from "@/lib/data/culture";

// ─── Age Group Config ─────────────────────────────────────────────────────────

const AGE_GROUPS = [
  { id: "all", label: "सभी उम्र" },
  { id: "3-6", label: "3–6 वर्ष" },
  { id: "6-10", label: "6–10 वर्ष" },
  { id: "10-14", label: "10–14 वर्ष" },
];

const AGE_COLORS: Record<string, string> = {
  "3-6": "bg-pink-100 text-pink-700",
  "6-10": "bg-blue-100 text-blue-700",
  "10-14": "bg-green-100 text-green-700",
  all: "bg-gray-100 text-gray-600",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  ganesha: "from-yellow-400 to-orange-400",
  krishna: "from-blue-400 to-indigo-500",
  hanuman: "from-orange-400 to-red-400",
  ramayana: "from-green-400 to-teal-500",
  shiva: "from-blue-500 to-purple-600",
  panchatantra: "from-amber-400 to-yellow-500",
  puranic: "from-rose-400 to-pink-500",
  mahabharata: "from-red-500 to-orange-500",
};

// ─── Story Modal ──────────────────────────────────────────────────────────────

function StoryModal({
  story,
  onClose,
}: {
  story: MythologyStory;
  onClose: () => void;
}) {
  const grad =
    CATEGORY_GRADIENTS[story.category] ?? "from-orange-400 to-amber-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className={`bg-gradient-to-br ${grad} p-8 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="text-5xl mb-3">
            {MYTHOLOGY_CATEGORIES.find((c) => c.id === story.category)?.icon ?? "📖"}
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            {story.titleHindi}
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full bg-white/20 ${
                AGE_COLORS[story.ageGroup] ?? "text-white"
              }`}
            >
              {story.ageGroup === "all" ? "सभी उम्र" : `${story.ageGroup} वर्ष`}
            </span>
            <span className="text-white/70 text-xs">
              {MYTHOLOGY_CATEGORIES.find((c) => c.id === story.category)?.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-7">
          {/* Story */}
          <div className="bg-orange-50 rounded-2xl p-5 mb-5 border border-orange-100">
            <p
              className="text-gray-800 text-base leading-relaxed font-serif"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              {story.summaryHindi}
            </p>
          </div>

          {/* Moral */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-green-800 font-bold text-sm mb-2 flex items-center gap-2">
              📚 <span>शिक्षा:</span>
            </p>
            <p className="text-green-700 text-base italic leading-relaxed font-serif">
              {story.moralHindi}
            </p>
          </div>
        </div>

        <div className="px-7 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tradition Modal ──────────────────────────────────────────────────────────

function TraditionModal({
  tradition,
  onClose,
}: {
  tradition: RegionalTradition;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-500 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
          <div className="text-5xl mb-3">{tradition.icon}</div>
          <h2 className="text-3xl font-extrabold">{tradition.nameHindi}</h2>
          <p className="text-green-100 text-sm mt-1">{tradition.name}</p>
          <div className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">
            📍 {tradition.region}
          </div>
        </div>

        {/* Body */}
        <div className="p-7 space-y-5">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-gray-700 text-base leading-relaxed font-serif">
              {tradition.descriptionHindi}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
              👧 <span>बच्चों को कैसे सिखाएँ:</span>
            </p>
            <p className="text-amber-700 text-base italic leading-relaxed">
              {tradition.howToTeachHindi}
            </p>
          </div>
        </div>

        <div className="px-7 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Story Card ───────────────────────────────────────────────────────────────

function StoryCard({
  story,
  onClick,
}: {
  story: MythologyStory;
  onClick: () => void;
}) {
  const catIcon =
    MYTHOLOGY_CATEGORIES.find((c) => c.id === story.category)?.icon ?? "📖";
  const grad =
    CATEGORY_GRADIENTS[story.category] ?? "from-orange-400 to-amber-500";

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-orange-200 overflow-hidden group"
    >
      <div className={`bg-gradient-to-br ${grad} p-5 text-white`}>
        <div className="text-4xl mb-2">{catIcon}</div>
        <p className="font-bold text-lg leading-snug">{story.titleHindi}</p>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-3">
          {story.summaryHindi}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              AGE_COLORS[story.ageGroup] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {story.ageGroup === "all" ? "सभी उम्र" : `${story.ageGroup} वर्ष`}
          </span>
          <span className="text-xs text-orange-500 font-semibold group-hover:underline">
            पूरी कथा पढ़ें →
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Tradition Card ───────────────────────────────────────────────────────────

function TraditionCard({
  tradition,
  onClick,
}: {
  tradition: RegionalTradition;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-green-200 overflow-hidden group"
    >
      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 flex items-center gap-4">
        <span className="text-4xl">{tradition.icon}</span>
        <div>
          <p className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
            {tradition.nameHindi}
          </p>
          <p className="text-xs text-gray-500">{tradition.name}</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">
          {tradition.descriptionHindi}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
            📍 {tradition.region.split("(")[0].trim()}
          </span>
          <span className="text-xs text-green-600 font-semibold group-hover:underline">
            जानें →
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type MainTab = "stories" | "traditions";

export default function CulturePage() {
  const [mainTab, setMainTab] = useState<MainTab>("stories");

  // Stories filters
  const [storyCat, setStoryCat] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [selectedStory, setSelectedStory] = useState<MythologyStory | null>(null);

  // Traditions filters
  const [tradCat, setTradCat] = useState("all");
  const [selectedTradition, setSelectedTradition] = useState<RegionalTradition | null>(null);

  const filteredStories = useMemo(() => {
    return MYTHOLOGY_STORIES.filter((s) => {
      const catMatch = storyCat === "all" || s.category === storyCat;
      const ageMatch = ageGroup === "all" || s.ageGroup === ageGroup || s.ageGroup === "all";
      return catMatch && ageMatch;
    });
  }, [storyCat, ageGroup]);

  const filteredTraditions = useMemo(() => {
    return REGIONAL_TRADITIONS.filter(
      (t) => tradCat === "all" || t.category === tradCat
    );
  }, [tradCat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            भारतीय संस्कृति और विरासत
          </h1>
          <p className="text-green-100 text-lg font-medium">
            बच्चों को सिखाएँ — अपनी महान संस्कृति
          </p>
          <p className="text-green-200 text-sm mt-1">
            Dhyan Foundation Guwahati
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Main Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-1.5 flex gap-1 mb-7">
          <button
            onClick={() => setMainTab("stories")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mainTab === "stories"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            <span>📖</span>
            <span>पौराणिक कथाएँ</span>
          </button>
          <button
            onClick={() => setMainTab("traditions")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mainTab === "traditions"
                ? "bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <span>🎨</span>
            <span>परंपराएँ और कलाएँ</span>
          </button>
        </div>

        {/* ── Stories Tab ── */}
        {mainTab === "stories" && (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {MYTHOLOGY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setStoryCat(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                    storyCat === cat.id
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Age Group Filters */}
            <div className="flex flex-wrap gap-2 mb-7">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setAgeGroup(ag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                    ageGroup === ag.id
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  {ag.label}
                </button>
              ))}
            </div>

            {/* Stories Grid */}
            {filteredStories.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">
                  इस फ़िल्टर के लिए कोई कथा नहीं मिली
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => setSelectedStory(story)}
                  />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-center text-xs text-gray-400 mt-10">
              सभी कथाएँ हिंदू धर्मग्रंथों एवं पुराणों पर आधारित हैं
            </p>
          </>
        )}

        {/* ── Traditions Tab ── */}
        {mainTab === "traditions" && (
          <>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-7">
              {TRADITION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTradCat(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                    tradCat === cat.id
                      ? "bg-green-600 text-white border-green-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Traditions Grid */}
            {filteredTraditions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500 text-lg">
                  इस श्रेणी में कोई परंपरा नहीं मिली
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTraditions.map((trad) => (
                  <TraditionCard
                    key={trad.id}
                    tradition={trad}
                    onClick={() => setSelectedTradition(trad)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}

      {/* Tradition Modal */}
      {selectedTradition && (
        <TraditionModal
          tradition={selectedTradition}
          onClose={() => setSelectedTradition(null)}
        />
      )}
    </div>
  );
}
