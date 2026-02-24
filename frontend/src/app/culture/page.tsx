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
import {
  VRAT_KATHAS,
  VRAT_KATHA_CATEGORIES,
  DEITY_TO_CATEGORY,
  type VratKatha,
} from "@/lib/data/vrat-kathas";

// ─── Age Group Config ──────────────────────────────────────────────────────────

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

// ─── Story Modal ───────────────────────────────────────────────────────────────

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
          <h2 className="text-3xl font-extrabold leading-tight">{story.titleHindi}</h2>
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/20 ${AGE_COLORS[story.ageGroup] ?? "text-white"}`}>
              {story.ageGroup === "all" ? "सभी उम्र" : `${story.ageGroup} वर्ष`}
            </span>
            <span className="text-white/70 text-xs">
              {MYTHOLOGY_CATEGORIES.find((c) => c.id === story.category)?.label}
            </span>
          </div>
        </div>
        <div className="p-7">
          <div className="bg-orange-50 rounded-2xl p-5 mb-5 border border-orange-100">
            <p className="text-gray-800 text-base leading-relaxed font-serif" style={{ fontFamily: "'Noto Serif', serif" }}>
              {story.summaryHindi}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-green-800 font-bold text-sm mb-2 flex items-center gap-2">
              📚 <span>शिक्षा:</span>
            </p>
            <p className="text-green-700 text-base italic leading-relaxed font-serif">{story.moralHindi}</p>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end">
          <button onClick={onClose} className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tradition Modal ───────────────────────────────────────────────────────────

function TraditionModal({ tradition, onClose }: { tradition: RegionalTradition; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-600 to-teal-500 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors" aria-label="Close">✕</button>
          <div className="text-5xl mb-3">{tradition.icon}</div>
          <h2 className="text-3xl font-extrabold">{tradition.nameHindi}</h2>
          <p className="text-green-100 text-sm mt-1">{tradition.name}</p>
          <div className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">📍 {tradition.region}</div>
        </div>
        <div className="p-7 space-y-5">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <p className="text-gray-700 text-base leading-relaxed font-serif">{tradition.descriptionHindi}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">👧 <span>बच्चों को कैसे सिखाएँ:</span></p>
            <p className="text-amber-700 text-base italic leading-relaxed">{tradition.howToTeachHindi}</p>
          </div>
        </div>
        <div className="px-7 pb-6 flex justify-end">
          <button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors">बंद करें</button>
        </div>
      </div>
    </div>
  );
}

// ─── Vrat Katha Modal ──────────────────────────────────────────────────────────

function VratKathaModal({ katha, onClose }: { katha: VratKatha; onClose: () => void }) {
  const [activeChapter, setActiveChapter] = useState(0);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const chaptersHtml = katha.chapters
      .map(
        (ch, i) => `
        <div class="chapter">
          <h3>${i + 1}. ${ch.titleHindi}</h3>
          <p>${ch.content}</p>
        </div>`
      )
      .join("");
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <meta charset="utf-8">
      <title>${katha.titleHindi}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari&display=swap');
        body { font-family: 'Noto Serif Devanagari', 'Noto Serif', serif; max-width: 700px; margin: 0 auto; padding: 24px; color: #222; font-size: 14px; line-height: 1.9; }
        h1 { font-size: 22px; color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; margin-bottom: 4px; }
        .meta { font-size: 12px; color: #666; margin-bottom: 20px; }
        h3 { font-size: 15px; color: #6d28d9; margin-top: 20px; margin-bottom: 6px; }
        .chapter { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #e5e7eb; }
        .chapter:last-child { border-bottom: none; }
        p { margin: 0; text-align: justify; }
        .significance { background: #f5f3ff; padding: 10px 14px; border-left: 3px solid #7c3aed; margin-bottom: 18px; font-size: 13px; }
      </style>
      </head><body>
      <h1>${katha.titleHindi}</h1>
      <div class="meta">${katha.icon} ${katha.occasionHindi} &nbsp;|&nbsp; स्रोत: ${katha.source}</div>
      <div class="significance">${katha.significanceHindi}</div>
      ${chaptersHtml}
      <p style="text-align:center;margin-top:24px;font-size:11px;color:#999;">— Dhyan Foundation Guwahati | dhyanfoundationguwahati.org —</p>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

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
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-7 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg" aria-label="Close">✕</button>
          <div className="text-4xl mb-2">{katha.icon}</div>
          <h2 className="text-2xl font-extrabold leading-tight">{katha.titleHindi}</h2>
          <p className="text-purple-200 text-sm mt-1">{katha.deity} · {katha.occasionHindi}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white/15 text-white text-xs px-3 py-1 rounded-full">{katha.monthHindi}</span>
            <span className="bg-white/15 text-white text-xs px-3 py-1 rounded-full">📜 {katha.source}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handlePrint} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
              🖨️ प्रिंट करें
            </button>
          </div>
        </div>

        {/* Significance */}
        <div className="mx-6 mt-5 bg-purple-50 border border-purple-100 rounded-2xl px-5 py-3">
          <p className="text-purple-800 text-sm leading-relaxed font-serif">{katha.significanceHindi}</p>
        </div>

        {/* Chapter Tabs (if multiple chapters) */}
        {katha.chapters.length > 1 && (
          <div className="mx-6 mt-4 flex flex-wrap gap-1.5">
            {katha.chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => setActiveChapter(i)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                  activeChapter === i
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-purple-400"
                }`}
              >
                {i + 1}. {ch.titleHindi.split("—")[0].trim().substring(0, 20)}…
              </button>
            ))}
          </div>
        )}

        {/* Chapter Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <h3 className="text-purple-700 font-bold text-base mb-3 leading-snug">
            {katha.chapters[activeChapter]?.titleHindi}
          </h3>
          <p
            className="text-gray-700 text-base leading-loose font-serif text-justify"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {katha.chapters[activeChapter]?.content}
          </p>

          {/* Puja Items */}
          {katha.pujaItems && katha.pujaItems.length > 0 && activeChapter === 0 && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-bold text-amber-800 text-sm mb-2">🌸 पूजा सामग्री:</p>
              <div className="flex flex-wrap gap-1.5">
                {katha.pujaItems.map((item, i) => (
                  <span key={i} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <button
            onClick={() => setActiveChapter((p) => Math.max(0, p - 1))}
            disabled={activeChapter === 0}
            className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← पिछला
          </button>
          <span className="text-xs text-gray-400">{activeChapter + 1} / {katha.chapters.length}</span>
          <button
            onClick={() => setActiveChapter((p) => Math.min(katha.chapters.length - 1, p + 1))}
            disabled={activeChapter === katha.chapters.length - 1}
            className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            अगला →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Story Card ────────────────────────────────────────────────────────────────

function StoryCard({ story, onClick }: { story: MythologyStory; onClick: () => void }) {
  const catIcon = MYTHOLOGY_CATEGORIES.find((c) => c.id === story.category)?.icon ?? "📖";
  const grad = CATEGORY_GRADIENTS[story.category] ?? "from-orange-400 to-amber-500";
  return (
    <button onClick={onClick} className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-orange-200 overflow-hidden group">
      <div className={`bg-gradient-to-br ${grad} p-5 text-white`}>
        <div className="text-4xl mb-2">{catIcon}</div>
        <p className="font-bold text-lg leading-snug">{story.titleHindi}</p>
      </div>
      <div className="p-4">
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-3">{story.summaryHindi}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${AGE_COLORS[story.ageGroup] ?? "bg-gray-100 text-gray-600"}`}>
            {story.ageGroup === "all" ? "सभी उम्र" : `${story.ageGroup} वर्ष`}
          </span>
          <span className="text-xs text-orange-500 font-semibold group-hover:underline">पूरी कथा पढ़ें →</span>
        </div>
      </div>
    </button>
  );
}

// ─── Tradition Card ────────────────────────────────────────────────────────────

function TraditionCard({ tradition, onClick }: { tradition: RegionalTradition; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-green-200 overflow-hidden group">
      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 flex items-center gap-4">
        <span className="text-4xl">{tradition.icon}</span>
        <div>
          <p className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{tradition.nameHindi}</p>
          <p className="text-xs text-gray-500">{tradition.name}</p>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">{tradition.descriptionHindi}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">📍 {tradition.region.split("(")[0].trim()}</span>
          <span className="text-xs text-green-600 font-semibold group-hover:underline">जानें →</span>
        </div>
      </div>
    </button>
  );
}

// ─── Vrat Katha Card ───────────────────────────────────────────────────────────

function VratKathaCard({ katha, onClick }: { katha: VratKatha; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-50 hover:border-purple-300 overflow-hidden group">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{katha.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-base leading-snug group-hover:text-purple-700 transition-colors">{katha.titleHindi}</p>
            <p className="text-xs text-gray-500 mt-0.5">{katha.deity}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-3">{katha.significanceHindi}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">📅 {katha.monthHindi}</span>
          <span className="text-xs text-purple-600 font-semibold group-hover:underline">कथा पढ़ें →</span>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type MainTab = "stories" | "traditions" | "vratkatha";

export default function CulturePage() {
  const [mainTab, setMainTab] = useState<MainTab>("stories");

  const [storyCat, setStoryCat] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");
  const [selectedStory, setSelectedStory] = useState<MythologyStory | null>(null);

  const [tradCat, setTradCat] = useState("all");
  const [selectedTradition, setSelectedTradition] = useState<RegionalTradition | null>(null);

  const [vratCat, setVratCat] = useState("all");
  const [selectedKatha, setSelectedKatha] = useState<VratKatha | null>(null);

  const filteredStories = useMemo(() => {
    return MYTHOLOGY_STORIES.filter((s) => {
      const catMatch = storyCat === "all" || s.category === storyCat;
      const ageMatch = ageGroup === "all" || s.ageGroup === ageGroup || s.ageGroup === "all";
      return catMatch && ageMatch;
    });
  }, [storyCat, ageGroup]);

  const filteredTraditions = useMemo(() => {
    return REGIONAL_TRADITIONS.filter((t) => tradCat === "all" || t.category === tradCat);
  }, [tradCat]);

  const filteredKathas = useMemo(() => {
    return VRAT_KATHAS.filter((k) => {
      if (vratCat === "all") return true;
      return DEITY_TO_CATEGORY[k.deity] === vratCat;
    });
  }, [vratCat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">भारतीय संस्कृति और विरासत</h1>
          <p className="text-green-100 text-lg font-medium">पौराणिक कथाएँ · व्रत कथाएँ · परंपराएँ</p>
          <p className="text-green-200 text-sm mt-1">Dhyan Foundation Guwahati</p>
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
            onClick={() => setMainTab("vratkatha")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              mainTab === "vratkatha"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                : "text-gray-500 hover:text-purple-700 hover:bg-purple-50"
            }`}
          >
            <span>🙏</span>
            <span>व्रत कथाएँ</span>
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
            <span>परंपराएँ</span>
          </button>
        </div>

        {/* ── Stories Tab ── */}
        {mainTab === "stories" && (
          <>
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
            {filteredStories.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-gray-500 text-lg">इस फ़िल्टर के लिए कोई कथा नहीं मिली</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStories.map((story) => (
                  <StoryCard key={story.id} story={story} onClick={() => setSelectedStory(story)} />
                ))}
              </div>
            )}
            <p className="text-center text-xs text-gray-400 mt-10">सभी कथाएँ हिंदू धर्मग्रंथों एवं पुराणों पर आधारित हैं</p>
          </>
        )}

        {/* ── Vrat Kathas Tab ── */}
        {mainTab === "vratkatha" && (
          <>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 mb-6">
              <p className="text-purple-800 text-sm font-medium leading-relaxed">
                🙏 <strong>मारवाड़ी और राजस्थानी व्रत-पूजा कथाएँ</strong> — पारंपरिक कथाएँ जो प्रत्येक व्रत और पूजा में सुनाई जाती हैं।
                स्रोत: <strong>गीता प्रेस, गोरखपुर</strong> एवं सनातन परंपरा।
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-7">
              {VRAT_KATHA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setVratCat(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 ${
                    vratCat === cat.id
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-700"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {filteredKathas.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🙏</div>
                <p className="text-gray-500 text-lg">इस श्रेणी में कोई कथा नहीं मिली</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredKathas.map((katha) => (
                  <VratKathaCard key={katha.id} katha={katha} onClick={() => setSelectedKatha(katha)} />
                ))}
              </div>
            )}
            <p className="text-center text-xs text-gray-400 mt-10">
              स्रोत: गीता प्रेस गोरखपुर · स्कंद पुराण · भागवत पुराण · भविष्य पुराण · शिव पुराण
            </p>
          </>
        )}

        {/* ── Traditions Tab ── */}
        {mainTab === "traditions" && (
          <>
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
            {filteredTraditions.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500 text-lg">इस श्रेणी में कोई परंपरा नहीं मिली</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTraditions.map((trad) => (
                  <TraditionCard key={trad.id} tradition={trad} onClick={() => setSelectedTradition(trad)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedStory && <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />}
      {selectedTradition && <TraditionModal tradition={selectedTradition} onClose={() => setSelectedTradition(null)} />}
      {selectedKatha && <VratKathaModal katha={selectedKatha} onClose={() => { setSelectedKatha(null); }} />}
    </div>
  );
}
