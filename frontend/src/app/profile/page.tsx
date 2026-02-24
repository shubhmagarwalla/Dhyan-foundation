"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Himachal Pradesh", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

interface ProfileForm {
  fullName: string;
  phone: string;
  pan?: string;
  fatherName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface Donation {
  id: string;
  date: string;
  amount: number;
  cause: string;
  gateway: string;
  status: "completed" | "pending" | "failed";
  transactionId: string;
  certificateUrl?: string;
}

const STATUS_STYLES: Record<Donation["status"], { bg: string; text: string; label: string }> = {
  completed: { bg: "#e8f5ee", text: "#2D6A4F", label: "Completed" },
  pending: { bg: "#fff3e0", text: "#FF6B00", label: "Pending" },
  failed: { bg: "#fef2f2", text: "#dc2626", label: "Failed" },
};

// ─── Avatar ─────────────────────────────────────────────────────────────
function Avatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-2xl border-4 border-white shadow-lg"
      style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
    >
      {initials}
    </div>
  );
}

// ─── My Details Tab ─────────────────────────────────────────────────────
function DetailsTab({ session }: { session: ReturnType<typeof useSession>["data"] }) {
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    defaultValues: {
      fullName: session?.user?.name || "",
    },
  });

  const onSave = async (data: ProfileForm) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile saved successfully!", {
        style: { background: "#2D6A4F", color: "white" },
      });
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5" noValidate>
      {/* 80G notice */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
      >
        <span className="text-xl flex-shrink-0">📄</span>
        <div>
          <div className="font-bold text-orange-700 text-sm">80G Details</div>
          <div className="text-orange-600 text-xs mt-0.5">
            Keep your PAN and address updated to receive valid 80G certificates for all donations.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="As per PAN card"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            {...register("phone")}
            type="tel"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="+91 9999567895"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            PAN Card <span className="text-gray-400">(for 80G)</span>
          </label>
          <input
            {...register("pan")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 uppercase"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Father&apos;s Name <span className="text-gray-400">(for 80G)</span>
          </label>
          <input
            {...register("fatherName")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="Father's full name"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <input
            {...register("address")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="Street, locality"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
          <input
            {...register("city")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="e.g. Guwahati"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
          <select
            {...register("state")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 bg-white"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
          <input
            {...register("pincode", { pattern: { value: /^\d{6}$/, message: "6-digit pincode" } })}
            type="text"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="781001"
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Donation History Tab ────────────────────────────────────────────────
function DonationHistoryTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch(`${API_URL}/donations/my`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setDonations(data);
        } else {
          // Fallback demo data for preview
          setDonations([
            {
              id: "DON001",
              date: "2026-02-01",
              amount: 2500,
              cause: "Gausewa",
              gateway: "Razorpay",
              status: "completed",
              transactionId: "pay_abc123",
              certificateUrl: "#",
            },
            {
              id: "DON002",
              date: "2026-01-15",
              amount: 1000,
              cause: "Medical",
              gateway: "Cashfree",
              status: "completed",
              transactionId: "cf_xyz456",
              certificateUrl: "#",
            },
            {
              id: "DON003",
              date: "2026-01-01",
              amount: 5000,
              cause: "Rescue",
              gateway: "Razorpay",
              status: "pending",
              transactionId: "pay_pending789",
            },
          ]);
        }
      } catch {
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FF6B00" strokeWidth="4" />
          <path className="opacity-75" fill="#FF6B00" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">🐄</div>
        <p className="font-semibold text-gray-500 mb-2">No donations yet</p>
        <p className="text-sm mb-6">Make your first donation to protect Gau Mata!</p>
        <a
          href="/donate"
          className="inline-block px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: "#FF6B00" }}
        >
          Donate Now
        </a>
      </div>
    );
  }

  const totalDonated = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      {/* Summary */}
      <div
        className="rounded-2xl p-5 mb-6 flex items-center justify-between"
        style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
      >
        <div>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Total Donated</div>
          <div className="text-3xl font-extrabold text-gray-800">
            ₹{totalDonated.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="text-4xl">🏆</div>
      </div>

      {/* Table (mobile: cards) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["Date", "Amount", "Cause", "Gateway", "Transaction ID", "Status", "Certificate"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {donations.map((d) => {
              const st = STATUS_STYLES[d.status];
              return (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-gray-600">
                    {new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-800">
                    ₹{d.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4 text-gray-600 capitalize">{d.cause}</td>
                  <td className="px-4 py-4 text-gray-600">{d.gateway}</td>
                  <td className="px-4 py-4 text-gray-400 font-mono text-xs">{d.transactionId}</td>
                  <td className="px-4 py-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: st.bg, color: st.text }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {d.certificateUrl ? (
                      <a
                        href={d.certificateUrl}
                        download
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "#FF6B00" }}
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {donations.map((d) => {
          const st = STATUS_STYLES[d.status];
          return (
            <div key={d.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-lg text-gray-800">
                  ₹{d.amount.toLocaleString("en-IN")}
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: st.bg, color: st.text }}
                >
                  {st.label}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>{new Date(d.date).toLocaleDateString("en-IN")}</div>
                <div className="capitalize">{d.cause} · {d.gateway}</div>
                <div className="font-mono text-xs text-gray-400">{d.transactionId}</div>
              </div>
              {d.certificateUrl && (
                <a
                  href={d.certificateUrl}
                  download
                  className="mt-3 block text-xs font-semibold hover:underline"
                  style={{ color: "#FF6B00" }}
                >
                  Download 80G Certificate →
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fff8f0" }}>
        <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FF6B00" strokeWidth="4" />
          <path className="opacity-75" fill="#FF6B00" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div
          className="rounded-3xl p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl"
          style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #2D6A4F 100%)",
          }}
        >
          <Avatar name={user?.name || "User"} image={user?.image} />
          <div className="text-white text-center sm:text-left">
            <h1 className="text-2xl font-extrabold">{user?.name || "Donor"}</h1>
            <p className="text-white/80 text-sm mt-1">{user?.email}</p>
            <div
              className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <span>🏆</span>
              <span>Dhyan Foundation Donor</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div
            className="flex border-b"
            style={{ borderColor: "#f0f0f0" }}
          >
            {(["details", "history"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="flex-1 py-4 px-6 text-sm font-bold transition-all duration-200 relative"
                style={{
                  color: activeTab === t ? "#FF6B00" : "#9ca3af",
                  background: activeTab === t ? "#fffdf8" : "white",
                }}
              >
                {t === "details" ? "My Details" : "Donation History"}
                {activeTab === t && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "#FF6B00" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "details" && <DetailsTab session={session} />}
            {activeTab === "history" && <DonationHistoryTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
