"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PanchangData = {
  tithi?: { name?: string; name_en?: string; paksha?: string };
  nakshatra?: { name?: string; name_en?: string };
  yoga?: { name?: string; name_en?: string };
  karana?: { name?: string; name_en?: string };
  vaara?: { name?: string; name_en?: string };
  sunrise?: string;
  sunset?: string;
  rahu_kaal?: { start?: string; end?: string };
  samvat?: { year?: number | string; month?: string };
  paksha?: string;
  error?: string;
  source?: string;
  // Raw Prokerala response may nest data inside .data
  data?: {
    tithi?: { name?: string; paksha?: string };
    nakshatra?: { name?: string };
    yoga?: { name?: string };
    karana?: { name?: string };
    vaara?: { name?: string };
    sunrise?: string;
    sunset?: string;
    rahu_kaal?: { start?: string; end?: string };
  };
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-orange-100" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-32 mb-1" />
      <div className="h-3 bg-gray-100 rounded w-20" />
    </div>
  );
}

// ─── Card Component ───────────────────────────────────────────────────────────

function PanchangCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow border border-gray-50">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${color}`}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-lg font-bold text-gray-800 leading-snug">{value}</p>
      {subValue && (
        <p className="text-sm text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toVikramSamvat(date: Date): { year: number; month: string } {
  // Approx Vikram Samvat = Gregorian year + 56/57
  const month = date.getMonth();
  const year =
    month >= 3 ? date.getFullYear() + 57 : date.getFullYear() + 56;
  const hindiMonths = [
    "माघ", "फाल्गुन", "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़",
    "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष",
  ];
  // Shift by 2 months (Gregorian Jan ≈ Vikram Paush)
  const vikramMonthIndex = (month + 10) % 12;
  return { year, month: hindiMonths[vikramMonthIndex] };
}

function formatGregorianHindi(date: Date): string {
  const hindiMonths = [
    "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्तूबर", "नवंबर", "दिसंबर",
  ];
  return `${date.getDate()} ${hindiMonths[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateForAPI(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function safeStr(val: unknown): string {
  if (!val) return "—";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return "—";
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PanchangPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const LAT = 26.1445;
  const LON = 91.7362;
  const TZ = 5.5;

  const fetchPanchang = useCallback(
    async (date: Date) => {
      setLoading(true);
      setError(null);
      setPanchang(null);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/astrology/panchang`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dob: formatDateForAPI(date),
            tob: "06:00",
            lat: LAT,
            lon: LON,
            tz: TZ,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setPanchang(json);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "अज्ञात त्रुटि";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPanchang(selectedDate);
  }, [selectedDate, fetchPanchang]);

  // Flatten potential nested Prokerala response
  const d = panchang?.data ?? panchang;

  const tithiName =
    safeStr(d?.tithi?.name) || safeStr((panchang as Record<string, unknown>)?.tithi_name);
  const nakshatraName =
    safeStr(d?.nakshatra?.name) || "—";
  const yogaName =
    safeStr(d?.yoga?.name) || "—";
  const karanaName =
    safeStr(d?.karana?.name) || "—";
  const varaName =
    safeStr(d?.vaara?.name) || "—";
  const sunrise = safeStr(d?.sunrise);
  const sunset = safeStr(d?.sunset);
  const rahuStart = safeStr(d?.rahu_kaal?.start);
  const rahuEnd = safeStr(d?.rahu_kaal?.end);
  const rahuStr =
    rahuStart !== "—" && rahuEnd !== "—"
      ? `${rahuStart} – ${rahuEnd}`
      : "—";

  const vikram = toVikramSamvat(selectedDate);
  const paksha =
    safeStr(d?.tithi?.paksha) ||
    safeStr((panchang as Record<string, unknown>)?.paksha) ||
    "—";

  const samvatYear =
    safeStr(panchang?.samvat?.year) !== "—"
      ? safeStr(panchang?.samvat?.year)
      : String(vikram.year);

  const samvatMonth =
    safeStr(panchang?.samvat?.month) !== "—"
      ? safeStr(panchang?.samvat?.month)
      : vikram.month;

  const pakshaDisplay =
    paksha.toLowerCase().includes("shukla") || paksha === "शुक्ल पक्ष"
      ? "शुक्ल पक्ष"
      : paksha.toLowerCase().includes("krishna") || paksha === "कृष्ण पक्ष"
      ? "कृष्ण पक्ष"
      : paksha !== "—"
      ? paksha
      : "—";

  const cards = [
    {
      icon: "🌙",
      label: "तिथि",
      value: tithiName,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: "⭐",
      label: "नक्षत्र",
      value: nakshatraName,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: "🕉️",
      label: "योग",
      value: yogaName,
      color: "bg-green-50 text-green-700",
    },
    {
      icon: "🔮",
      label: "करण",
      value: karanaName,
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: "📅",
      label: "वार",
      value: varaName,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: "🌅",
      label: "सूर्योदय / सूर्यास्त",
      value:
        sunrise !== "—" && sunset !== "—"
          ? `${sunrise} / ${sunset}`
          : "—",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: "⚠️",
      label: "राहु काल",
      value: rahuStr,
      color: "bg-red-50 text-red-600",
    },
    {
      icon: "🏛️",
      label: "विक्रम संवत",
      value: samvatYear !== "—" ? `संवत ${samvatYear}` : `संवत ${vikram.year}`,
      subValue: samvatMonth,
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: paksha.toLowerCase().includes("krishna") ? "🌑" : "🌕",
      label: "पक्ष",
      value: pakshaDisplay,
      color: "bg-slate-50 text-slate-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-3">📅</div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            पंचांग
          </h1>
          <p className="text-orange-100 text-lg font-medium">
            विक्रम संवत पंचांग — Vikram Samvat Panchang
          </p>
          <p className="text-orange-200 text-sm mt-2">
            Powered by{" "}
            <a
              href="https://api.prokerala.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Prokerala API
            </a>
          </p>
          <p className="text-orange-100 text-xs mt-1">
            स्थान: गुवाहाटी, असम (26.14°N, 91.74°E)
          </p>
        </div>
      </div>

      {/* ── Date Bar ── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-md -mt-6 mb-8 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">आज की तिथि</p>
            <p className="text-xl font-bold text-gray-800">
              {formatGregorianHindi(selectedDate)}
            </p>
            <p className="text-sm text-orange-600 font-semibold">
              विक्रम संवत {vikram.year} — {vikram.month}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <label className="text-xs text-gray-500 font-medium">
              अन्य तिथि चुनें
            </label>
            <input
              type="date"
              value={formatDateForAPI(selectedDate)}
              onChange={(e) => {
                const val = e.target.value;
                if (val) setSelectedDate(new Date(val + "T00:00:00"));
              }}
              max={formatDateForAPI(
                new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
              )}
              className="border border-orange-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-center">
            <div className="text-4xl mb-3">🚫</div>
            <p className="text-red-700 font-semibold text-lg mb-1">
              पंचांग अभी उपलब्ध नहीं है
            </p>
            <p className="text-red-500 text-sm">
              {error.includes("fetch") || error.includes("network")
                ? "नेटवर्क से जुड़ने में समस्या हुई। कृपया पुनः प्रयास करें।"
                : `त्रुटि: ${error}`}
            </p>
            <button
              onClick={() => fetchPanchang(selectedDate)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              पुनः प्रयास करें
            </button>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Panchang Cards ── */}
        {!loading && !error && panchang && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {cards.map((card) => (
                <PanchangCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  subValue={card.subValue}
                  color={card.color}
                />
              ))}
            </div>

            {/* ── Note ── */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 text-center">
              <p className="text-amber-800 text-sm font-medium">
                🔭 यह पंचांग आर्यभट्ट सिद्धांत पर आधारित है
              </p>
              <p className="text-amber-600 text-xs mt-1">
                समय IST (UTC+5:30) में दर्शाए गए हैं। लाहिरी अयनांश उपयोग किया गया है।
              </p>
            </div>
          </>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && !panchang && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-gray-500">पंचांग लोड हो रहा है…</p>
          </div>
        )}
      </div>
    </div>
  );
}
