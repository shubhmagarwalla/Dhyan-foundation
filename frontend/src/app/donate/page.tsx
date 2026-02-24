"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Types ─────────────────────────────────────────────────────────────
interface DonorDetails {
  fullName: string;
  email: string;
  phone: string;
  pan?: string;
  fatherName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  beneficiaryName?: string;
  beneficiaryRelation?: string;
}

const AMOUNTS = [500, 1000, 2500, 5000, 10000];
const CAUSES = [
  { id: "gausewa", label: "Gausewa (General)", icon: "🐄" },
  { id: "medical", label: "Medical Treatment", icon: "💊" },
  { id: "feed", label: "Feed & Nutrition", icon: "🌾" },
  { id: "rescue", label: "Rescue Operations", icon: "🚨" },
];
const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Gujarat", "Haryana",
  "Himachal Pradesh", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other",
];

// ─── Progress Bar ───────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 flex-shrink-0"
              style={{
                background: i + 1 <= step ? "#FF6B00" : "white",
                borderColor: i + 1 <= step ? "#FF6B00" : "#e5e7eb",
                color: i + 1 <= step ? "white" : "#9ca3af",
              }}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 transition-all duration-500"
                style={{
                  background: i + 1 < step ? "#FF6B00" : "#e5e7eb",
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Type</span>
        <span>Amount</span>
        <span>Details</span>
        <span>Payment</span>
      </div>
    </div>
  );
}

// ─── Step 1: Donation Type ──────────────────────────────────────────────
function Step1({
  donationType,
  setDonationType,
  onNext,
}: {
  donationType: string;
  setDonationType: (t: string) => void;
  onNext: () => void;
}) {
  const options = [
    {
      id: "onetime",
      label: "One-Time Donation",
      icon: "💝",
      description: "Make a single donation of any amount. Perfect for a direct act of Gau Seva.",
      badge: "Most flexible",
      badgeColor: "#FF6B00",
    },
    {
      id: "monthly",
      label: "Monthly Giving",
      icon: "♻️",
      description: "Set up a recurring monthly donation. Ensure continuous care for the cows.",
      badge: "Most impact",
      badgeColor: "#2D6A4F",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Choose Donation Type</h2>
      <p className="text-gray-400 mb-8">How would you like to contribute to Gau Seva?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setDonationType(opt.id)}
            className="relative text-left p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              borderColor: donationType === opt.id ? opt.badgeColor : "#e5e7eb",
              background: donationType === opt.id ? `${opt.badgeColor}08` : "white",
            }}
          >
            {/* Badge */}
            <span
              className="absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ background: opt.badgeColor }}
            >
              {opt.badge}
            </span>
            <div className="text-4xl mb-3">{opt.icon}</div>
            <h3 className="font-extrabold text-gray-800 text-lg mb-2">{opt.label}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{opt.description}</p>
            {donationType === opt.id && (
              <div
                className="mt-4 text-xs font-bold flex items-center gap-1"
                style={{ color: opt.badgeColor }}
              >
                <span>✓</span> Selected
              </div>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!donationType}
        className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all hover:scale-[1.01] disabled:opacity-40"
        style={{ background: "#FF6B00" }}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Step 2: Amount & Cause ─────────────────────────────────────────────
function Step2({
  amount,
  setAmount,
  customAmount,
  setCustomAmount,
  cause,
  setCause,
  onNext,
  onBack,
}: {
  amount: number | null;
  setAmount: (a: number) => void;
  customAmount: string;
  setCustomAmount: (v: string) => void;
  cause: string;
  setCause: (c: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const effectiveAmount = customAmount ? parseInt(customAmount) : amount;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Choose Amount & Cause</h2>
      <p className="text-gray-400 mb-8">Select how much you&apos;d like to donate and where it goes.</p>

      {/* Preset Amounts */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Donation Amount</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustomAmount(""); }}
              className="py-3 rounded-xl font-bold border-2 transition-all hover:scale-105"
              style={{
                borderColor: amount === a && !customAmount ? "#FF6B00" : "#e5e7eb",
                background: amount === a && !customAmount ? "#FF6B00" : "white",
                color: amount === a && !customAmount ? "white" : "#374151",
              }}
            >
              ₹{a >= 1000 ? `${a / 1000}k` : a}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
            className="w-full pl-9 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            min={100}
          />
        </div>
        {effectiveAmount && effectiveAmount > 0 && (
          <div
            className="mt-3 text-sm font-medium rounded-lg px-4 py-2"
            style={{ background: "#fff3e0", color: "#FF6B00" }}
          >
            You&apos;re donating ₹{effectiveAmount.toLocaleString("en-IN")} — eligible for 80G deduction
          </div>
        )}
      </div>

      {/* Cause */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Cause</label>
        <div className="grid grid-cols-2 gap-3">
          {CAUSES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCause(c.id)}
              className="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: cause === c.id ? "#2D6A4F" : "#e5e7eb",
                background: cause === c.id ? "#e8f5ee" : "white",
              }}
            >
              <span className="text-2xl">{c.icon}</span>
              <span
                className="font-semibold text-sm"
                style={{ color: cause === c.id ? "#2D6A4F" : "#374151" }}
              >
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!effectiveAmount || effectiveAmount < 100 || !cause}
          className="flex-1 py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all hover:scale-[1.01] disabled:opacity-40"
          style={{ background: "#FF6B00" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Donor Details ──────────────────────────────────────────────
function Step3({
  onNext,
  onBack,
  setDonorDetails,
}: {
  onNext: () => void;
  onBack: () => void;
  setDonorDetails: (d: DonorDetails) => void;
}) {
  const { data: session } = useSession();
  const [forBeneficiary, setForBeneficiary] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonorDetails>({
    defaultValues: {
      fullName: (session?.user?.name as string) || "",
      email: (session?.user?.email as string) || "",
    },
  });

  const onSubmit = (data: DonorDetails) => {
    setDonorDetails(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Donor Details</h2>
      <p className="text-gray-400 mb-4">Required for 80G tax certificate issuance.</p>

      {/* 80G Reminder */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
      >
        <span className="text-xl flex-shrink-0">📄</span>
        <div>
          <div className="font-bold text-orange-700 text-sm">80G Tax Deduction Available</div>
          <div className="text-orange-600 text-xs mt-0.5">
            PAN card number is required to receive an 80G certificate. Father&apos;s name is required for formal filing.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Full Name */}
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

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
            type="email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            {...register("phone", { required: "Phone is required" })}
            type="tel"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="+91 9999567895"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* PAN */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            PAN <span className="text-gray-400">(for 80G)</span>
          </label>
          <input
            {...register("pan")}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 uppercase"
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </div>

        {/* Father's Name */}
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

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            {...register("address", { required: "Address is required" })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="Street address, locality"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            {...register("city", { required: "City is required" })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="e.g. Guwahati"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            {...register("state", { required: "State is required" })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700 bg-white"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            {...register("pincode", { required: "Pincode is required", pattern: { value: /^\d{6}$/, message: "Invalid pincode" } })}
            type="text"
            maxLength={6}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-400 text-gray-700"
            placeholder="781001"
          />
          {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
        </div>
      </div>

      {/* Beneficiary Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setForBeneficiary(!forBeneficiary)}
          className="flex items-center gap-2 text-sm font-semibold transition-colors"
          style={{ color: "#2D6A4F" }}
        >
          <span
            className="w-5 h-5 rounded border-2 flex items-center justify-center text-xs"
            style={{
              borderColor: "#2D6A4F",
              background: forBeneficiary ? "#2D6A4F" : "white",
              color: "white",
            }}
          >
            {forBeneficiary ? "✓" : ""}
          </span>
          Donating on behalf of someone else?
        </button>

        {forBeneficiary && (
          <div className="mt-4 p-4 rounded-xl border-2 border-green-200 bg-green-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Beneficiary Name</label>
              <input
                {...register("beneficiaryName")}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-gray-700"
                placeholder="Beneficiary's full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Relation</label>
              <input
                {...register("beneficiaryRelation")}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-green-400 text-gray-700"
                placeholder="e.g. Parent, Spouse"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-1 py-4 rounded-xl font-bold text-white text-lg shadow-md transition-all hover:scale-[1.01]"
          style={{ background: "#FF6B00" }}
        >
          Continue →
        </button>
      </div>
    </form>
  );
}

// ─── Step 4: Payment Gateway ────────────────────────────────────────────
function Step4({
  amount,
  cause,
  donationType,
  donorDetails,
  onBack,
}: {
  amount: number;
  cause: string;
  donationType: string;
  donorDetails: DonorDetails | null;
  onBack: () => void;
}) {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedGateway || !donorDetails) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_URL}/donations/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          cause,
          donation_type: donationType,
          gateway: selectedGateway,
          donor: donorDetails,
        }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      if (selectedGateway === "razorpay" && data.razorpay_order_id) {
        alert(`Razorpay order created: ${data.razorpay_order_id}\n(Integrate Razorpay checkout here)`);
      } else if (selectedGateway === "cashfree" && data.payment_link) {
        window.location.href = data.payment_link;
      }
    } catch {
      alert("Payment initialization failed. Please try again or contact us.");
    } finally {
      setIsProcessing(false);
    }
  };

  const gateways = [
    {
      id: "razorpay",
      name: "Pay via Razorpay",
      description: "UPI, Cards, Net Banking, Wallets",
      icon: "⚡",
      color: "#3B82F6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      id: "cashfree",
      name: "Pay via Cashfree",
      description: "UPI, Cards, EMI, Net Banking",
      icon: "💳",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Choose Payment Gateway</h2>
      <p className="text-gray-400 mb-8">Select your preferred payment method to complete the donation.</p>

      {/* Summary */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{ background: "#fff3e0", border: "1px solid #FFD9B0" }}
      >
        <div className="text-sm font-bold text-orange-700 mb-3">Donation Summary</div>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-gray-500">Amount:</span>
          <span className="font-bold text-gray-800">₹{amount.toLocaleString("en-IN")}</span>
          <span className="text-gray-500">Cause:</span>
          <span className="font-bold text-gray-800 capitalize">{cause}</span>
          <span className="text-gray-500">Type:</span>
          <span className="font-bold text-gray-800 capitalize">{donationType}</span>
          <span className="text-gray-500">Donor:</span>
          <span className="font-bold text-gray-800">{donorDetails?.fullName}</span>
          <span className="text-gray-500">80G Benefit:</span>
          <span className="font-bold text-green-700">Yes (if PAN provided)</span>
        </div>
      </div>

      {/* Gateway cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {gateways.map((gw) => (
          <button
            key={gw.id}
            onClick={() => setSelectedGateway(gw.id)}
            className="text-left p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              borderColor: selectedGateway === gw.id ? gw.color : gw.border,
              background: selectedGateway === gw.id ? gw.bg : "white",
            }}
          >
            <div className="text-4xl mb-3">{gw.icon}</div>
            <div className="font-extrabold text-gray-800 mb-1">{gw.name}</div>
            <div className="text-sm text-gray-500">{gw.description}</div>
            {selectedGateway === gw.id && (
              <div className="mt-3 text-xs font-bold" style={{ color: gw.color }}>✓ Selected</div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={handlePayment}
          disabled={!selectedGateway || isProcessing}
          className="flex-1 py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all hover:scale-[1.01] disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #FF6B00, #2D6A4F)" }}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Donate ₹${amount.toLocaleString("en-IN")} Now`
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────
export default function DonatePage() {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState("onetime");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [cause, setCause] = useState("");
  const [donorDetails, setDonorDetails] = useState<DonorDetails | null>(null);

  const effectiveAmount = customAmount ? parseInt(customAmount) : (amount || 0);

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ background: "linear-gradient(180deg, #fff8f0 0%, #f0faf5 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors mb-4 block">
            ← Back to Home
          </Link>
          <div className="text-4xl mb-3">🐄</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Donate for Gau Seva
          </h1>
          <p className="text-gray-500">
            Every rupee protects a cow. 80G tax benefits available.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <ProgressBar step={step} total={4} />

          {step === 1 && (
            <Step1
              donationType={donationType}
              setDonationType={setDonationType}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <Step2
              amount={amount}
              setAmount={setAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              cause={cause}
              setCause={setCause}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              setDonorDetails={setDonorDetails}
            />
          )}
          {step === 4 && (
            <Step4
              amount={effectiveAmount}
              cause={cause}
              donationType={donationType}
              donorDetails={donorDetails}
              onBack={() => setStep(3)}
            />
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">🔒 256-bit Encrypted</div>
          <div className="flex items-center gap-1.5">📄 80G Certificate</div>
          <div className="flex items-center gap-1.5">✅ Registered NGO</div>
        </div>
      </div>
    </div>
  );
}
