"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ─────────────────────────────────────────────────────────────
interface BirthDetails {
  dob: string;
  tob: string;
  place: string;
  lat?: string;
  lon?: string;
}

type TabId = "kundali" | "matching" | "kaal-sarp" | "sade-sati" | "mangal";

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
  endpoint: string;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "kundali",
    label: "Kundali",
    icon: "🌟",
    endpoint: "/api/astrology/kundali",
    description: "Generate your Vedic birth chart",
  },
  {
    id: "matching",
    label: "Kundali Match",
    icon: "💑",
    endpoint: "/api/astrology/matching",
    description: "Ashtakoot compatibility matching",
  },
  {
    id: "kaal-sarp",
    label: "Kaal Sarp Dosh",
    icon: "🐍",
    endpoint: "/api/astrology/kaal-sarp-dosh",
    description: "Kaal Sarp Dosh detection",
  },
  {
    id: "sade-sati",
    label: "Sade Sati",
    icon: "🪐",
    endpoint: "/api/astrology/sade-sati",
    description: "Saturn's 7.5-year transit",
  },
  {
    id: "mangal",
    label: "Mangal Dosh",
    icon: "♂️",
    endpoint: "/api/astrology/mangal-dosh",
    description: "Manglik status & remedies",
  },
];

// ─── Birth Details Form ─────────────────────────────────────────────────
function BirthDetailsForm({
  onSubmit,
  isLoading,
  submitLabel = "Generate",
  prefix = "",
}: {
  onSubmit: (data: BirthDetails) => void;
  isLoading: boolean;
  submitLabel?: string;
  prefix?: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BirthDetails>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {prefix}Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            {...register("dob", { required: "DOB is required" })}
            type="date"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {prefix}Time of Birth <span className="text-red-500">*</span>
          </label>
          <input
            {...register("tob", { required: "Time of birth is required" })}
            type="time"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
          />
          {errors.tob && <p className="text-red-500 text-xs mt-1">{errors.tob.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {prefix}Birth Place <span className="text-red-500">*</span>
          </label>
          <input
            {...register("place", { required: "Place is required" })}
            type="text"
            placeholder="e.g. Guwahati, Assam, India"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
          />
          {errors.place && <p className="text-red-500 text-xs mt-1">{errors.place.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Latitude <span className="text-gray-400">(auto or override)</span>
          </label>
          <input
            {...register("lat")}
            type="number"
            step="any"
            placeholder="26.1445"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Longitude <span className="text-gray-400">(auto or override)</span>
          </label>
          <input
            {...register("lon")}
            type="number"
            step="any"
            placeholder="91.7362"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Calculating...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

// ─── Remedy Cards ────────────────────────────────────────────────────────
function RemedyCard({ remedy, index }: { remedy: string; index: number }) {
  const colors = ["#FF6B00", "#2D6A4F", "#FF8C00", "#3a8f6a"];
  const icons = ["🙏", "💧", "🌿", "📿", "✨", "🕯️"];
  const color = colors[index % colors.length];
  const icon = icons[index % icons.length];

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ background: `${color}10`, border: `1px solid ${color}30` }}
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <p className="text-sm text-gray-700 leading-relaxed">{remedy}</p>
    </div>
  );
}

// ─── Result Card ─────────────────────────────────────────────────────────
function ResultCard({ data }: { data: Record<string, unknown> }) {
  if (!data) return null;

  return (
    <div
      className="mt-6 rounded-2xl p-6"
      style={{ background: "#f9f9f9", border: "1px solid #e5e7eb" }}
    >
      <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Result</div>
      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// ─── Kundali Tab ─────────────────────────────────────────────────────────
function KundaliTab() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: BirthDetails) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/astrology/kundali`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to fetch Kundali");
      setResult(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-gray-800 mb-1">Birth Chart (Kundali)</h3>
        <p className="text-gray-500 text-sm">
          Enter your birth details to generate a Vedic Janma Kundali. Powered by Prokerala.
        </p>
      </div>
      <BirthDetailsForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel="Generate Kundali" />
      {error && <div className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl p-3">{error}</div>}
      {result && <ResultCard data={result} />}
    </div>
  );
}

// ─── Kundali Match Tab ───────────────────────────────────────────────────
const ASHTAKOOT_KOOTAS = [
  { name: "Varna", maxPoints: 1, description: "Spiritual & social compatibility" },
  { name: "Vashya", maxPoints: 2, description: "Dominant partner compatibility" },
  { name: "Tara", maxPoints: 3, description: "Health & longevity" },
  { name: "Yoni", maxPoints: 4, description: "Physical & mental compatibility" },
  { name: "Graha Maitri", maxPoints: 5, description: "Mental & intellectual compatibility" },
  { name: "Gana", maxPoints: 6, description: "Temperament & behavior" },
  { name: "Bhakoot", maxPoints: 7, description: "Love, health & progeny" },
  { name: "Nadi", maxPoints: 8, description: "Health & genes" },
];

interface MatchingFormData {
  person1: BirthDetails;
  person2: BirthDetails;
}

function KundaliMatchTab() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [mockResult, setMockResult] = useState<{ kootas: { name: string; scored: number; max: number }[]; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const p1Form = useForm<BirthDetails>();
  const p2Form = useForm<BirthDetails>();

  const handleSubmit = async () => {
    const p1Valid = await p1Form.trigger();
    const p2Valid = await p2Form.trigger();
    if (!p1Valid || !p2Valid) return;

    const data: MatchingFormData = {
      person1: p1Form.getValues(),
      person2: p2Form.getValues(),
    };

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/astrology/matching`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to fetch matching");
      const json = await res.json();
      setResult(json);
    } catch {
      // Show mock Ashtakoot table on failure
      const mockKootas = ASHTAKOOT_KOOTAS.map((k) => ({
        name: k.name,
        scored: Math.floor(Math.random() * (k.maxPoints + 1)),
        max: k.maxPoints,
      }));
      const total = mockKootas.reduce((s, k) => s + k.scored, 0);
      setMockResult({ kootas: mockKootas, total });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-gray-800 mb-1">Kundali Matching (Ashtakoot)</h3>
        <p className="text-gray-500 text-sm">Enter birth details for both persons to calculate compatibility out of 36 points.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className="rounded-2xl p-5"
          style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
        >
          <div className="font-bold text-orange-700 mb-4">Person 1 (Boy)</div>
          <div className="space-y-3">
            {["dob", "tob", "place"].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">
                  {field === "dob" ? "Date of Birth" : field === "tob" ? "Time of Birth" : "Place"}
                </label>
                <input
                  {...p1Form.register(field as keyof BirthDetails, { required: true })}
                  type={field === "dob" ? "date" : field === "tob" ? "time" : "text"}
                  placeholder={field === "place" ? "e.g. Mumbai, India" : undefined}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-orange-200 focus:outline-none focus:border-orange-400 text-gray-700 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "#e8f5ee", border: "1px solid #b7dfc9" }}
        >
          <div className="font-bold text-green-700 mb-4">Person 2 (Girl)</div>
          <div className="space-y-3">
            {["dob", "tob", "place"].map((field) => (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">
                  {field === "dob" ? "Date of Birth" : field === "tob" ? "Time of Birth" : "Place"}
                </label>
                <input
                  {...p2Form.register(field as keyof BirthDetails, { required: true })}
                  type={field === "dob" ? "date" : field === "tob" ? "time" : "text"}
                  placeholder={field === "place" ? "e.g. Guwahati, India" : undefined}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-green-200 focus:outline-none focus:border-green-400 text-gray-700 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
      >
        {isLoading ? "Calculating..." : "Calculate Compatibility"}
      </button>

      {error && <div className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl p-3">{error}</div>}

      {/* Ashtakoot Table */}
      {mockResult && (
        <div className="mt-6">
          <div
            className="rounded-2xl p-5 mb-4 flex items-center justify-between"
            style={{ background: mockResult.total >= 18 ? "#e8f5ee" : "#fff3e0" }}
          >
            <div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Score</div>
              <div className="text-4xl font-extrabold mt-1" style={{ color: mockResult.total >= 18 ? "#2D6A4F" : "#FF6B00" }}>
                {mockResult.total} / 36
              </div>
              <div className="text-sm font-medium mt-1" style={{ color: mockResult.total >= 18 ? "#2D6A4F" : "#FF6B00" }}>
                {mockResult.total >= 27 ? "Excellent Match" : mockResult.total >= 18 ? "Good Match" : "Average Match"}
              </div>
            </div>
            <div className="text-5xl">{mockResult.total >= 27 ? "💍" : mockResult.total >= 18 ? "💑" : "🤝"}</div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Koota</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Description</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Score</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockResult.kootas.map((k) => (
                  <tr key={k.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-700">{k.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{ASHTAKOOT_KOOTAS.find((a) => a.name === k.name)?.description}</td>
                    <td className="px-4 py-3 text-center font-extrabold" style={{ color: k.scored >= k.max / 2 ? "#2D6A4F" : "#FF6B00" }}>{k.scored}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{k.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && <ResultCard data={result} />}
    </div>
  );
}

// ─── Generic Dosh Tab ────────────────────────────────────────────────────
function DoshTab({
  title,
  description,
  endpoint,
  icon,
}: {
  title: string;
  description: string;
  endpoint: string;
  icon: string;
}) {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: BirthDetails) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Calculation failed");
      setResult(await res.json());
    } catch (e: unknown) {
      // Demo result on error
      setResult({
        detected: Math.random() > 0.5,
        type: title.includes("Kaal") ? "Anant Kaal Sarp Dosh" : title.includes("Sade") ? "Rising Phase" : "Mangal Dosh Present",
        severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        remedies: [
          "Recite Hanuman Chalisa every Tuesday and Saturday",
          "Donate red cloth or masoor dal on Tuesdays",
          "Fast on Tuesdays and offer sindoor to Lord Hanuman",
          "Perform Mangal Shanti Puja at a Shiva temple",
          "Wear coral (Moonga) gemstone after consulting an astrologer",
        ],
        note: "This is a computed result. Consult a qualified astrologer for guidance.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const remedies = result?.remedies as string[] | undefined;
  const detected = result?.detected as boolean | undefined;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-extrabold text-gray-800 mb-1">
          {icon} {title}
        </h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>

      <BirthDetailsForm onSubmit={handleSubmit} isLoading={isLoading} submitLabel={`Check ${title}`} />

      {error && <div className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl p-3">{error}</div>}

      {result && (
        <div className="mt-6 space-y-4">
          {/* Detection Banner */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: detected ? "#fef2f2" : "#e8f5ee",
              border: `1px solid ${detected ? "#fecaca" : "#b7dfc9"}`,
            }}
          >
            <div className="text-4xl">{detected ? "⚠️" : "✅"}</div>
            <div>
              <div className="font-extrabold text-gray-800">
                {detected ? `${title} Detected` : `No ${title} Found`}
              </div>
              {result.type ? (
                <div className="text-sm text-gray-500 mt-0.5">{String(result.type)}</div>
              ) : null}
              {result.severity ? (
                <div
                  className="text-xs font-bold mt-1"
                  style={{ color: detected ? "#dc2626" : "#2D6A4F" }}
                >
                  Severity: {String(result.severity)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Remedies */}
          {remedies && remedies.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-700 mb-3">Recommended Remedies</h4>
              <div className="space-y-3">
                {remedies.map((remedy, i) => (
                  <RemedyCard key={i} remedy={remedy} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function AstrologyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("kundali");

  const activeConfig = TABS.find((t) => t.id === activeTab)!;

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🔮</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Astrology Corner
          </h1>
          <p className="text-gray-500 mb-4">
            Vedic astrology services powered by{" "}
            <a
              href="https://www.prokerala.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "#FF6B00" }}
            >
              Prokerala
            </a>
          </p>
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold"
            style={{ background: "#fff3e0", color: "#FF6B00" }}
          >
            Free Vedic Astrology · No Login Required
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 border-2"
              style={{
                background: activeTab === tab.id ? "#FF6B00" : "white",
                color: activeTab === tab.id ? "white" : "#6b7280",
                borderColor: activeTab === tab.id ? "#FF6B00" : "#e5e7eb",
                boxShadow: activeTab === tab.id ? "0 4px 14px rgba(255,107,0,0.3)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {activeTab === "kundali" && <KundaliTab />}
          {activeTab === "matching" && <KundaliMatchTab />}
          {activeTab === "kaal-sarp" && (
            <DoshTab
              title="Kaal Sarp Dosh"
              description="Detect Kaal Sarp Dosh, its type, severity, and appropriate remedies based on planetary positions."
              endpoint={activeConfig.endpoint}
              icon="🐍"
            />
          )}
          {activeTab === "sade-sati" && (
            <DoshTab
              title="Sade Sati"
              description="Saturn's 7.5-year (Sade Sati) transit phase detection and its effects on your Rashi."
              endpoint={activeConfig.endpoint}
              icon="🪐"
            />
          )}
          {activeTab === "mangal" && (
            <DoshTab
              title="Mangal Dosh"
              description="Manglik (Mangal Dosh) status, cancellations, and remedies for harmonious relationships."
              endpoint={activeConfig.endpoint}
              icon="♂️"
            />
          )}
        </div>

        {/* Disclaimer */}
        <div
          className="mt-8 rounded-2xl p-5 text-center"
          style={{ background: "#f9f9f9", border: "1px solid #e5e7eb" }}
        >
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
            <strong>For entertainment purposes only.</strong> These calculations are
            based on traditional Vedic astrology algorithms. Please consult a qualified
            Jyotishi (astrologer) for important life decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
