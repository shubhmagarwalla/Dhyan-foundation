"use client";

import { useState, useMemo } from "react";
import {
  PRAYERS,
  PRAYER_CATEGORIES,
  DEITY_ICONS,
  type Prayer,
} from "@/lib/data/prayers";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "aarti" | "chalisa" | "stotra";
type DeityFilter = "all" | "Ganesha" | "Shiva" | "Vishnu" | "Durga" | "Hanuman";

// ─── Verse Modal ──────────────────────────────────────────────────────────────

function PrayerModal({
  prayer,
  onClose,
}: {
  prayer: Prayer;
  onClose: () => void;
}) {
  const handlePrint = () => window.print();
  const handleShare = async () => {
    try {
      await navigator.share({
        title: prayer.title,
        text: prayer.verses.map((v) => v.text).join("\n\n"),
      });
    } catch {
      // share not supported or cancelled — ignore silently
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-3xl p-6 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-3xl mb-1">
                {DEITY_ICONS[prayer.deity] ?? "🕉️"}
              </div>
              <h2 className="text-2xl font-extrabold leading-tight">
                {prayer.title}
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                {prayer.deity}
                {prayer.festival ? ` · ${prayer.festival}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              📤 Share
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              🖨️ Print
            </button>
          </div>
        </div>

        {/* Verses */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {prayer.verses.map((verse, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5"
            >
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
                {idx + 1}
              </p>
              <p
                className="font-serif text-gray-800 text-lg leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {verse.text}
              </p>
              {verse.meaning && (
                <p className="text-sm text-gray-500 mt-3 italic leading-relaxed border-t border-orange-100 pt-3">
                  {verse.meaning}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
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

// ─── Prayer Card ──────────────────────────────────────────────────────────────

function PrayerCard({
  prayer,
  onClick,
}: {
  prayer: Prayer;
  onClick: () => void;
}) {
  const catInfo = PRAYER_CATEGORIES[prayer.category];
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-orange-200 overflow-hidden group"
    >
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 flex items-center gap-3">
        <span className="text-4xl">{DEITY_ICONS[prayer.deity] ?? "🕉️"}</span>
        <div>
          <p className="font-bold text-gray-800 text-base leading-snug group-hover:text-orange-600 transition-colors">
            {prayer.title}
          </p>
          <p className="text-sm text-gray-500">{prayer.deity}</p>
        </div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            catInfo?.color === "orange"
              ? "bg-orange-100 text-orange-700"
              : catInfo?.color === "green"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {catInfo?.icon} {catInfo?.label}
        </span>
        {prayer.festival && (
          <span className="text-xs text-gray-400 truncate max-w-[120px]">
            {prayer.festival}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const DEITY_FILTERS: { key: DeityFilter; icon: string; label: string }[] = [
  { key: "all", icon: "🕉️", label: "सभी" },
  { key: "Ganesha", icon: "🐘", label: "गणेश" },
  { key: "Shiva", icon: "🔱", label: "शिव" },
  { key: "Vishnu", icon: "🐚", label: "विष्णु" },
  { key: "Durga", icon: "⚔️", label: "दुर्गा" },
  { key: "Hanuman", icon: "🙏", label: "हनुमान" },
];

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "aarti", label: "आरती / भजन", icon: "🪔" },
  { key: "chalisa", label: "चालीसा", icon: "📿" },
  { key: "stotra", label: "स्तोत्र", icon: "🕉️" },
];

export default function PrayersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("aarti");
  const [deityFilter, setDeityFilter] = useState<DeityFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);

  const filtered = useMemo(() => {
    return PRAYERS.filter((p) => {
      const tabMatch =
        activeTab === "aarti"
          ? p.category === "aarti"
          : p.category === activeTab;
      const deityMatch = deityFilter === "all" || p.deity === deityFilter;
      const searchMatch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.deity.toLowerCase().includes(search.toLowerCase());
      return tabMatch && deityMatch && searchMatch;
    });
  }, [activeTab, deityFilter, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-3">🪔</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            आरती, चालीसा और स्तोत्र
          </h1>
          <p className="text-orange-100 text-lg">
            Dhyan Foundation Guwahati — भक्ति संग्रह
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-1.5 flex gap-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setDeityFilter("all");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="नाम या देवता से खोजें…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white shadow-sm"
          />
        </div>

        {/* Deity Filters */}
        <div className="flex flex-wrap gap-2 mb-7">
          {DEITY_FILTERS.map((df) => (
            <button
              key={df.key}
              onClick={() => setDeityFilter(df.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                deityFilter === df.key
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <span>{df.icon}</span>
              <span>{df.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">
              कोई परिणाम नहीं मिला
            </p>
            <p className="text-gray-400 text-sm mt-1">
              खोज या फ़िल्टर बदलकर देखें
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onClick={() => setSelectedPrayer(prayer)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPrayer && (
        <PrayerModal
          prayer={selectedPrayer}
          onClose={() => setSelectedPrayer(null)}
        />
      )}
    </div>
  );
}
