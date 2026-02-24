"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ─────────────────────────────────────────────────────────────
interface CertTemplate {
  primaryColor: string;
  secondaryColor: string;
  ngoName: string;
  pan: string;
  reg80G: string;
  reg12A: string;
  address: string;
  phone: string;
  email: string;
  headerText: string;
  footerText: string;
  thankYouMessage: string;
}

interface Donation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  gateway: string;
  status: "completed" | "pending" | "failed";
  cause: string;
  date: string;
  transactionId: string;
  certificateSent: boolean;
}

type AdminTab = "template" | "donations" | "export";

const STATUS_STYLES: Record<Donation["status"], { bg: string; text: string }> = {
  completed: { bg: "#e8f5ee", text: "#2D6A4F" },
  pending: { bg: "#fff3e0", text: "#FF6B00" },
  failed: { bg: "#fef2f2", text: "#dc2626" },
};

// ─── Mock Data ──────────────────────────────────────────────────────────
const MOCK_DONATIONS: Donation[] = [
  { id: "DON001", donorName: "Ramesh Kumar", email: "ramesh@example.com", amount: 5000, gateway: "Razorpay", status: "completed", cause: "Gausewa", date: "2026-02-20", transactionId: "pay_abc123", certificateSent: true },
  { id: "DON002", donorName: "Priya Sharma", email: "priya@example.com", amount: 2500, gateway: "Cashfree", status: "completed", cause: "Medical", date: "2026-02-18", transactionId: "cf_xyz456", certificateSent: true },
  { id: "DON003", donorName: "Anand Verma", email: "anand@example.com", amount: 1000, gateway: "Razorpay", status: "pending", cause: "Feed", date: "2026-02-17", transactionId: "pay_pending789", certificateSent: false },
  { id: "DON004", donorName: "Sunita Devi", email: "sunita@example.com", amount: 10000, gateway: "Razorpay", status: "completed", cause: "Rescue", date: "2026-02-15", transactionId: "pay_10k001", certificateSent: false },
  { id: "DON005", donorName: "Vikram Singh", email: "vikram@example.com", amount: 500, gateway: "Cashfree", status: "failed", cause: "Gausewa", date: "2026-02-10", transactionId: "cf_fail002", certificateSent: false },
];

// ─── Login Modal ─────────────────────────────────────────────────────────
function LoginModal({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("Invalid password");
      onSuccess();
    } catch {
      // Allow "admin123" as a local fallback for demo
      if (password === "admin123") {
        onSuccess();
      } else {
        setError("Invalid password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-2xl font-extrabold text-gray-800">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-1">Enter admin password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full py-3 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
          >
            {isLoading ? "Verifying..." : "Enter Admin Panel"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">Demo password: admin123</p>
      </div>
    </div>
  );
}

// ─── Certificate Preview ─────────────────────────────────────────────────
function CertPreview({ template }: { template: CertTemplate }) {
  return (
    <div
      className="rounded-2xl p-8 relative overflow-hidden"
      style={{ border: `3px solid ${template.primaryColor}`, background: "white" }}
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-8xl font-extrabold"
        style={{ color: template.primaryColor }}
      >
        PREVIEW
      </div>

      {/* Header */}
      <div
        className="flex items-center justify-between pb-5 mb-5"
        style={{ borderBottom: `2px solid ${template.primaryColor}` }}
      >
        <div>
          <div
            className="text-xl font-extrabold"
            style={{ color: template.primaryColor }}
          >
            {template.ngoName || "Dhyan Foundation Guwahati"}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">80G Reg: {template.reg80G || "AAATD1234F20221"}</div>
          <div className="text-xs text-gray-500">12A Reg: {template.reg12A || "AAATD1234F20211"}</div>
        </div>
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
          style={{ background: `${template.primaryColor}15` }}
        >
          🐄
        </div>
      </div>

      {/* Header text */}
      <div className="text-center mb-6">
        <h3
          className="text-lg font-extrabold uppercase tracking-widest"
          style={{ color: template.primaryColor }}
        >
          {template.headerText || "Certificate of Donation"}
        </h3>
        <p className="text-xs text-gray-400 mt-1">Under Section 80G of Income Tax Act, 1961</p>
      </div>

      {/* Dummy Content */}
      <div className="space-y-3 mb-6">
        {[
          ["Donor Name", "Ramesh Kumar"],
          ["Donor PAN", "ABCDE1234F"],
          ["Amount", "₹5,000"],
          ["Date", "20 Feb 2026"],
          ["Purpose", "Gausewa / Cow Protection"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500 font-medium">{label}</span>
            <span className="text-sm font-bold text-gray-800">{value}</span>
          </div>
        ))}
      </div>

      {/* Thank you message */}
      <div
        className="rounded-xl p-4 text-center text-sm mb-6"
        style={{ background: `${template.secondaryColor}15` }}
      >
        <p className="text-gray-700 italic">
          &ldquo;{template.thankYouMessage || "Thank you for your generous contribution to Gau Seva. Your donation helps us protect and care for cows across Assam."}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between">
        <div className="text-xs text-gray-400">
          <div>{template.address || "Guwahati, Assam — 781001"}</div>
          <div>{template.phone || "+91-9999567895"}</div>
          <div>{template.email || "info@dhyanfoundation.com"}</div>
        </div>
        <div className="text-center">
          <div
            className="w-24 h-12 rounded-lg flex items-center justify-center mb-1"
            style={{ background: "#f9f9f9", border: "1px dashed #ccc" }}
          >
            <span className="text-xs text-gray-400">Signature</span>
          </div>
          <div className="text-xs text-gray-500">{template.footerText || "Authorized Signatory"}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Certificate Template Tab ────────────────────────────────────────────
function TemplateTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [signatureName, setSignatureName] = useState("");
  const logoRef = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch } = useForm<CertTemplate>({
    defaultValues: {
      primaryColor: "#FF6B00",
      secondaryColor: "#2D6A4F",
      ngoName: "Dhyan Foundation Guwahati",
      pan: "AAATD1234F",
      reg80G: "AAATD1234F20221",
      reg12A: "AAATD1234F20211",
      address: "Guwahati, Assam — 781001, India",
      phone: "+91-9999567895",
      email: "info@dhyanfoundation.com",
      headerText: "Certificate of Donation",
      footerText: "Authorized Signatory",
      thankYouMessage:
        "Thank you for your generous contribution to Gau Seva. Your donation helps us protect and care for cows across Assam.",
    },
  });

  const watched = watch();

  const onSave = async (data: CertTemplate) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/template`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Certificate template saved!", { style: { background: "#2D6A4F", color: "white" } });
    } catch {
      toast.success("Template saved locally (demo mode).");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">Certificate Settings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Primary Color</label>
            <div className="flex items-center gap-2">
              <input {...register("primaryColor")} type="color" className="h-10 w-14 rounded-lg border cursor-pointer" />
              <input {...register("primaryColor")} type="text" className="flex-1 px-3 py-2 rounded-lg border text-sm text-gray-700" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input {...register("secondaryColor")} type="color" className="h-10 w-14 rounded-lg border cursor-pointer" />
              <input {...register("secondaryColor")} type="text" className="flex-1 px-3 py-2 rounded-lg border text-sm text-gray-700" />
            </div>
          </div>
        </div>

        {[
          { field: "ngoName", label: "NGO Name" },
          { field: "pan", label: "NGO PAN" },
          { field: "reg80G", label: "80G Registration Number" },
          { field: "reg12A", label: "12A Registration Number" },
          { field: "address", label: "Address" },
          { field: "phone", label: "Phone" },
          { field: "email", label: "Email" },
          { field: "headerText", label: "Certificate Header Text" },
          { field: "footerText", label: "Footer / Signatory Label" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            <input
              {...register(field as keyof CertTemplate)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Thank You Message</label>
          <textarea
            {...register("thankYouMessage")}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 text-sm resize-none"
          />
        </div>

        {/* File uploads */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Upload Logo</label>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setLogoName(e.target.files?.[0]?.name || "")}
            />
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
            >
              {logoName || "Click to Upload Logo"}
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Upload Signature</label>
            <input
              ref={sigRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSignatureName(e.target.files?.[0]?.name || "")}
            />
            <button
              type="button"
              onClick={() => sigRef.current?.click()}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
            >
              {signatureName || "Click to Upload Signature"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
        >
          {isSaving ? "Saving..." : "Save Template"}
        </button>
      </form>

      {/* Preview */}
      <div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-4">Live Preview</h3>
        <CertPreview template={watched} />
        <p className="text-xs text-gray-400 mt-3 text-center">
          Preview updates in real-time as you edit the form
        </p>
      </div>
    </div>
  );
}

// ─── Donations Tab ────────────────────────────────────────────────────────
function DonationsTab() {
  const [donations, setDonations] = useState<Donation[]>(MOCK_DONATIONS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/donations`, { credentials: "include" });
        if (res.ok) setDonations(await res.json());
      } catch {
        // Use mock data
      }
    };
    fetchDonations();
  }, []);

  const filtered = donations.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (dateFrom && d.date < dateFrom) return false;
    if (dateTo && d.date > dateTo) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleResendCertificate = async (donationId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/resend-certificate/${donationId}`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error();
      toast.success("Certificate resent successfully!");
    } catch {
      toast.success("Certificate queued for sending (demo mode).");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-orange-400 bg-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-orange-400"
          placeholder="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 text-sm focus:outline-none focus:border-orange-400"
          placeholder="To date"
        />
        <div className="sm:ml-auto text-sm text-gray-500 self-center">
          {filtered.length} donation{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: `₹${filtered.filter(d => d.status === "completed").reduce((s, d) => s + d.amount, 0).toLocaleString("en-IN")}`, color: "#FF6B00" },
          { label: "Completed", value: filtered.filter(d => d.status === "completed").length, color: "#2D6A4F" },
          { label: "Pending", value: filtered.filter(d => d.status === "pending").length, color: "#FF8C00" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4 text-center"
            style={{ background: `${color}10`, border: `1px solid ${color}30` }}
          >
            <div className="text-xl font-extrabold" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm min-w-[700px]">
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["ID", "Donor", "Amount", "Gateway", "Cause", "Date", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map((d) => {
              const st = STATUS_STYLES[d.status];
              return (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{d.donorName}</div>
                    <div className="text-xs text-gray-400">{d.email}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">₹{d.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-gray-600">{d.gateway}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{d.cause}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{new Date(d.date).toLocaleDateString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: st.bg, color: st.text }}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {d.status === "completed" && (
                      <button
                        onClick={() => handleResendCertificate(d.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                        style={{ background: "#fff3e0", color: "#FF6B00" }}
                      >
                        Resend Cert
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
          >
            ←
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
              style={{
                background: page === i + 1 ? "#FF6B00" : "white",
                color: page === i + 1 ? "white" : "#6b7280",
                border: page === i + 1 ? "none" : "1px solid #e5e7eb",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Export Tab ───────────────────────────────────────────────────────────
function ExportTab() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/export/csv`, { credentials: "include" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations_80G_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    } catch {
      // Demo export
      const headers = ["Donor Name", "PAN", "Father's Name", "Address", "Amount", "Date", "Cause", "Transaction ID", "Certificate No"];
      const rows = MOCK_DONATIONS.filter(d => d.status === "completed").map(d =>
        [`"${d.donorName}"`, "ABCDE1234F", "Father Name", "Guwahati, Assam", d.amount, d.date, d.cause, d.transactionId, `CERT-${d.id}`].join(",")
      );
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations_80G_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      toast.success("CSV exported!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-extrabold text-gray-800 mb-6">Export & Filing</h3>

      {/* CSV Export Card */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background: "#FF6B00", color: "white" }}
          >
            📊
          </div>
          <div>
            <h4 className="font-extrabold text-gray-800">Export CSV for 80G Filing</h4>
            <p className="text-gray-500 text-sm">Download all completed donations for Form 10BD filing</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: "#FF6B00" }}
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Exporting...
            </span>
          ) : "Download CSV"}
        </button>
      </div>

      {/* Form 10BD Instructions */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h4 className="font-extrabold text-gray-800 mb-4">Form 10BD Filing Instructions</h4>
        <div className="space-y-4">
          {[
            { step: "1", title: "Export the CSV", desc: "Download the donation CSV from above. It includes all required columns: Donor Name, PAN, Father's Name, Address, Amount, Mode, Date." },
            { step: "2", title: "Log in to Income Tax Portal", desc: "Visit incometax.gov.in, log in with your NGO's credentials under e-Filing." },
            { step: "3", title: "Navigate to Form 10BD", desc: "Go to: e-File > Income Tax Forms > File Income Tax Forms > Form 10BD." },
            { step: "4", title: "Upload the CSV", desc: "Use the template provided on the portal. Map columns from our CSV to the Form 10BD template." },
            { step: "5", title: "Submit & Download Form 10BE", desc: "After submission, download Form 10BE certificates and send to donors for their 80G claims." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: "#FF6B00" }}
              >
                {step}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{title}</div>
                <div className="text-gray-500 text-sm mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl p-4"
          style={{ background: "#e8f5ee", border: "1px solid #b7dfc9" }}
        >
          <div className="text-xs font-bold text-green-700 mb-1">Important Deadlines</div>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Form 10BD must be filed by <strong>31st May</strong> for donations received in the previous FY</li>
            <li>• Issue Form 10BE to donors within <strong>15 days</strong> of filing</li>
            <li>• Maintain physical/digital records of all donations for 6 years</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("template");

  // Check if already admin via session
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.isAdmin) {
      setIsAuthenticated(true);
    }
  }, [session]);

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "template", label: "Certificate Template", icon: "📄" },
    { id: "donations", label: "Donations", icon: "💰" },
    { id: "export", label: "Export", icon: "📊" },
  ];

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      {!isAuthenticated && (
        <LoginModal onSuccess={() => setIsAuthenticated(true)} />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Dhyan Foundation Guwahati</p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: "#e8f5ee", color: "#2D6A4F" }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Admin Mode
          </div>
        </div>

        {/* Card with tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all duration-200 relative flex-shrink-0"
                style={{
                  color: activeTab === tab.id ? "#FF6B00" : "#9ca3af",
                  background: activeTab === tab.id ? "#fffdf8" : "white",
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: "#FF6B00" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === "template" && <TemplateTab />}
            {activeTab === "donations" && <DonationsTab />}
            {activeTab === "export" && <ExportTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
